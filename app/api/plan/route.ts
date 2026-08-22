import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { journeyCopy } from "@/content/journey-copy";
import { computeJourney, loadEventRulePack } from "@/lib/engine/journey";
import { createPlan } from "@/lib/plans/plan";
import { cookiePlanStorage } from "@/lib/plans/storage";

function isAnswers(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function POST(request: Request) {
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
    !("eventId" in body) ||
    !("answers" in body) ||
    typeof body.eventId !== "string" ||
    !isAnswers(body.answers)
  ) {
    return NextResponse.json(
      { error: journeyCopy.api.invalid },
      { status: 400 },
    );
  }

  try {
    const pack = loadEventRulePack(body.eventId);

    if (pack.tier !== 1) {
      throw new Error("Tier 1 required");
    }

    const plan = createPlan(body.eventId, body.answers);
    const nodes = computeJourney(plan.eventId, plan.answers, plan.statuses);
    const storage = cookiePlanStorage(await cookies());
    await storage.save(plan);

    return NextResponse.json({ code: plan.code, nodes });
  } catch {
    return NextResponse.json(
      { error: journeyCopy.api.unavailable },
      { status: 404 },
    );
  }
}
