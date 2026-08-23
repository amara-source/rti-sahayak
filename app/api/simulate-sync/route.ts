import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { trackerCopy } from "@/content/tracker-copy";
import { computeJourney } from "@/lib/engine/journey";
import {
  approveFiledTask,
  NoSyncCandidateError,
  simulateSync,
} from "@/lib/plans/sync";
import { cookiePlanStorage } from "@/lib/plans/storage";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: trackerCopy.api.invalid },
      { status: 400 },
    );
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("code" in body) ||
    typeof body.code !== "string"
  ) {
    return NextResponse.json(
      { error: trackerCopy.api.invalid },
      { status: 400 },
    );
  }

  const storage = cookiePlanStorage(await cookies());
  const plan = await storage.load();

  if (!plan || plan.code !== body.code) {
    return NextResponse.json(
      { error: trackerCopy.api.planNotFound },
      { status: 404 },
    );
  }

  try {
    const filedApproval =
      "mode" in body &&
      body.mode === "filed-approval" &&
      "nodeId" in body &&
      typeof body.nodeId === "string"
        ? body.nodeId
        : null;
    const result = filedApproval
      ? approveFiledTask(plan, filedApproval)
      : simulateSync(plan);
    const nodes = computeJourney(
      result.plan.eventId,
      result.plan.answers,
      result.plan.statuses,
    );

    await storage.save(result.plan);

    return NextResponse.json({
      plan: result.plan,
      nodes,
      events: result.events,
      unlocked: result.unlocked,
    });
  } catch (error) {
    if (error instanceof NoSyncCandidateError) {
      return NextResponse.json(
        { error: trackerCopy.api.noTasks },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: trackerCopy.api.invalid },
      { status: 400 },
    );
  }
}
