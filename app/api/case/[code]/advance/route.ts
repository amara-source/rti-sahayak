import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { rtiCopy } from "@/content/rti-copy";
import { computeJourney } from "@/lib/engine/journey";
import { advancePlan } from "@/lib/plans/plan";
import { cookiePlanStorage } from "@/lib/plans/storage";

interface Props {
  params: Promise<{ code: string }>;
}

export async function POST(request: Request, { params }: Props) {
  const { code } = await params;
  const storage = cookiePlanStorage(await cookies());
  const plan = await storage.load();
  if (!plan || plan.code !== code) {
    return NextResponse.json({ error: rtiCopy.api.notFound }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: rtiCopy.api.invalid }, { status: 400 });
  }

  const days =
    typeof body === "object" &&
    body !== null &&
    "days" in body &&
    typeof body.days === "number"
      ? body.days
      : null;
  if (days === null || !Number.isFinite(days) || days <= 0 || days > 365) {
    return NextResponse.json({ error: rtiCopy.api.invalid }, { status: 400 });
  }

  try {
    const result = advancePlan(plan, days * 24);
    await storage.save(result.plan);
    const nodes = computeJourney(
      result.plan.eventId,
      result.plan.answers,
      result.plan.statuses,
      result.plan.elapsedHours,
    );
    return NextResponse.json({
      case: result.plan,
      nodes,
      fired: result.fired,
    });
  } catch {
    return NextResponse.json({ error: rtiCopy.api.invalid }, { status: 400 });
  }
}
