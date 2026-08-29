import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { rtiCopy } from "@/content/rti-copy";
import { computeJourney } from "@/lib/engine/journey";
import { evaluatePreflightChecks } from "@/lib/engine/checks";
import { createSubmittedCase } from "@/lib/plans/plan";
import { cookiePlanStorage } from "@/lib/plans/storage";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * A filing date is optional, but when given it must be a real ISO date and
 * cannot be in the future: the reply period runs from the day the authority
 * received the application.
 */
function isFilingDate(value: unknown): boolean {
  if (value === undefined) return true;
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) return false;
  return value <= new Date().toISOString().slice(0, 10);
}

export async function GET() {
  const storage = cookiePlanStorage(await cookies());
  const plan = await storage.load();
  if (!plan) {
    return NextResponse.json({ error: rtiCopy.api.notFound }, { status: 404 });
  }
  const nodes = computeJourney(
    plan.eventId,
    plan.answers,
    plan.statuses,
    plan.elapsedHours ?? 0,
  );
  return NextResponse.json({ case: plan, nodes });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: rtiCopy.api.invalid }, { status: 400 });
  }

  if (!isRecord(body) || !isRecord(body.extracted)) {
    return NextResponse.json({ error: rtiCopy.api.invalid }, { status: 400 });
  }

  const extracted = body.extracted;
  const manualFiling = body.manualFiling === true && extracted.bodyLevel === "state";
  if (
    (extracted.bodyLevel !== "central" && !manualFiling) ||
    typeof extracted.rewritten !== "string" ||
    typeof extracted.singleSubject !== "boolean" ||
    typeof extracted.asksForRecords !== "boolean" ||
    typeof extracted.hasIdentityDocuments !== "boolean" ||
    !["yes", "no", "na"].includes(String(extracted.isBPL)) ||
    typeof extracted.hasBplCertificate !== "boolean" ||
    !isFilingDate(extracted.filedOn)
  ) {
    return NextResponse.json({ error: rtiCopy.api.invalid }, { status: 400 });
  }

  const attachments = Array.isArray(extracted.attachments)
    ? extracted.attachments
        .filter(
          (item): item is Record<string, unknown> =>
            isRecord(item) &&
            typeof item.name === "string" &&
            typeof item.type === "string" &&
            typeof item.size === "number",
        )
        .map((item) => ({
          name: item.name as string,
          type: item.type as string,
          size: item.size as number,
        }))
    : undefined;
  const checks = evaluatePreflightChecks({
    bodyLevel: extracted.bodyLevel as "central" | "state",
    text: extracted.rewritten,
    singleSubject: extracted.singleSubject,
    asksForRecords: extracted.asksForRecords,
    hasIdentityDocuments: extracted.hasIdentityDocuments,
    attachments,
    isBPL: extracted.isBPL as "yes" | "no" | "na",
    hasBplCertificate: extracted.hasBplCertificate,
  });
  if (
    checks.some(
      (check) =>
        check.status === "block" &&
        !(manualFiling && check.id === "jurisdiction"),
    )
  ) {
    return NextResponse.json(
      { error: rtiCopy.checks.blocked, checks },
      { status: 409 },
    );
  }

  const plan = createSubmittedCase({
    subject: extracted.subject,
    bodyLevel: extracted.bodyLevel,
    state: extracted.state,
    lifeLiberty: extracted.lifeLiberty,
    isBPL: extracted.isBPL,
    wantsAction: extracted.wantsAction,
    authorityId: extracted.authorityId,
    authorityName: extracted.authorityName,
    officer: extracted.officer,
    rewritten: extracted.rewritten,
    registrationNumber: extracted.registrationNumber,
    filedOn: extracted.filedOn,
  });
  const storage = cookiePlanStorage(await cookies());
  await storage.save(plan);
  const nodes = computeJourney(
    plan.eventId,
    plan.answers,
    plan.statuses,
    plan.elapsedHours,
  );

  return NextResponse.json({ code: plan.code, nodes });
}
