import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { rtiCopy } from "@/content/rti-copy";
import { computeJourney } from "@/lib/engine/journey";
import type { Status } from "@/lib/engine/types";
import { patchPlan } from "@/lib/plans/plan";
import { cookiePlanStorage } from "@/lib/plans/storage";

interface Props {
  params: Promise<{ code: string }>;
}

const statuses = new Set<Status>(["none", "applied", "stuck", "done"]);

async function load(code: string) {
  const storage = cookiePlanStorage(await cookies());
  const plan = await storage.load();
  return plan?.code === code ? { plan, storage } : null;
}

export async function GET(_request: Request, { params }: Props) {
  const { code } = await params;
  const stored = await load(code);
  if (!stored) {
    return NextResponse.json({ error: rtiCopy.api.notFound }, { status: 404 });
  }

  const nodes = computeJourney(
    stored.plan.eventId,
    stored.plan.answers,
    stored.plan.statuses,
    stored.plan.elapsedHours ?? 0,
  );
  return NextResponse.json({ case: stored.plan, nodes });
}

export async function PATCH(request: Request, { params }: Props) {
  const { code } = await params;
  const stored = await load(code);
  if (!stored) {
    return NextResponse.json({ error: rtiCopy.api.notFound }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: rtiCopy.api.invalid }, { status: 400 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("nodeId" in body) ||
    !("status" in body) ||
    typeof body.nodeId !== "string" ||
    typeof body.status !== "string" ||
    !statuses.has(body.status as Status)
  ) {
    return NextResponse.json({ error: rtiCopy.api.invalid }, { status: 400 });
  }

  try {
    const result = patchPlan(stored.plan, {
      nodeId: body.nodeId,
      status: body.status as Status,
    });
    await stored.storage.save(result.plan);
    const nodes = computeJourney(
      result.plan.eventId,
      result.plan.answers,
      result.plan.statuses,
      result.plan.elapsedHours ?? 0,
    );
    return NextResponse.json({
      case: result.plan,
      nodes,
      unlocked: result.unlocked,
    });
  } catch {
    return NextResponse.json({ error: rtiCopy.api.invalid }, { status: 400 });
  }
}
