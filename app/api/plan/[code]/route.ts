import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { journeyCopy } from "@/content/journey-copy";
import { computeJourney } from "@/lib/engine/journey";
import type { Status } from "@/lib/engine/types";
import { patchPlan } from "@/lib/plans/plan";
import { cookiePlanStorage } from "@/lib/plans/storage";

interface PlanRouteProps {
  params: Promise<{ code: string }>;
}

const statuses = new Set<Status>(["none", "applied", "stuck", "done"]);

async function storedPlan(code: string) {
  const storage = cookiePlanStorage(await cookies());
  const plan = await storage.load();

  return plan?.code === code ? { plan, storage } : null;
}

export async function GET(_request: Request, { params }: PlanRouteProps) {
  const { code } = await params;
  const stored = await storedPlan(code);

  if (!stored) {
    return NextResponse.json(
      { error: journeyCopy.api.planNotFound },
      { status: 404 },
    );
  }

  const nodes = computeJourney(
    stored.plan.eventId,
    stored.plan.answers,
    stored.plan.statuses,
  );

  return NextResponse.json({ plan: stored.plan, nodes });
}

export async function PATCH(request: Request, { params }: PlanRouteProps) {
  const { code } = await params;
  const stored = await storedPlan(code);

  if (!stored) {
    return NextResponse.json(
      { error: journeyCopy.api.planNotFound },
      { status: 404 },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: journeyCopy.api.invalid },
      { status: 400 },
    );
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("nodeId" in body) ||
    typeof body.nodeId !== "string"
  ) {
    return NextResponse.json(
      { error: journeyCopy.api.invalid },
      { status: 400 },
    );
  }

  const status =
    "status" in body && typeof body.status === "string"
      ? (body.status as Status)
      : undefined;
  const ack =
    "ack" in body && typeof body.ack === "string"
      ? body.ack.trim()
      : undefined;

  if ((status && !statuses.has(status)) || (ack !== undefined && !ack)) {
    return NextResponse.json(
      { error: journeyCopy.api.invalid },
      { status: 400 },
    );
  }

  if (ack !== undefined && !/^SYNTHETIC-[A-Z0-9-]{1,30}$/i.test(ack)) {
    return NextResponse.json(
      { error: journeyCopy.api.syntheticReference },
      { status: 400 },
    );
  }

  try {
    const result = patchPlan(stored.plan, {
      nodeId: body.nodeId,
      status,
      ack,
    });
    await stored.storage.save(result.plan);
    const nodes = computeJourney(
      result.plan.eventId,
      result.plan.answers,
      result.plan.statuses,
    );

    return NextResponse.json({
      plan: result.plan,
      nodes,
      unlocked: result.unlocked,
    });
  } catch {
    return NextResponse.json(
      { error: journeyCopy.api.taskNotFound },
      { status: 404 },
    );
  }
}
