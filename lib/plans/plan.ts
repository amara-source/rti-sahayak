import { computeJourney } from "../engine/journey";
import type { Plan, Status } from "../engine/types";

const CODE_ALPHABET = "BCDFGHJKLMNPQRSTVWXYZ23456789";

export interface PlanPatch {
  nodeId: string;
  status?: Status;
  ack?: string;
}

export interface PatchedPlan {
  plan: Plan;
  unlocked: string[];
}

const preFilingNodeIds = [
  "jurisdiction_check",
  "identify_authority",
  "draft_request",
  "preflight",
] as const;

function createCode(): string {
  const values = crypto.getRandomValues(new Uint8Array(6));

  return Array.from(
    values,
    (value) => CODE_ALPHABET[value % CODE_ALPHABET.length],
  ).join("");
}

export function createPlan(
  eventId: string,
  answers: Record<string, unknown>,
): Plan {
  const now = new Date().toISOString();

  return {
    code: createCode(),
    eventId,
    answers: { ...answers },
    statuses: {},
    acks: {},
    syncEvents: [],
    elapsedHours: 0,
    startedAtHours: {},
    lang: "en",
    createdAt: now,
    updatedAt: now,
  };
}

export function createSubmittedCase(
  answers: Record<string, unknown>,
): Plan {
  const plan = createPlan("rti", answers);
  // The filing step differs by route: a state case is filed with the state
  // authority, a central one on the portal. Everything after it is identical.
  const filingNode =
    answers.bodyLevel === "state" ? "state_filing" : "submit";
  plan.statuses = Object.fromEntries(
    [...preFilingNodeIds, filingNode].map((id) => [id, "done" as const]),
  );
  return plan;
}

export function advancePlan(
  plan: Plan,
  hours: number,
): { plan: Plan; fired: string[] } {
  if (!Number.isFinite(hours) || hours <= 0) {
    throw new Error("Advance hours must be positive");
  }

  const before = computeJourney(
    plan.eventId,
    plan.answers,
    plan.statuses,
    plan.elapsedHours ?? 0,
  );
  const nextPlan: Plan = {
    ...plan,
    elapsedHours: (plan.elapsedHours ?? 0) + hours,
    statuses: { ...plan.statuses },
    acks: { ...plan.acks },
    syncEvents: [...plan.syncEvents],
    startedAtHours: { ...(plan.startedAtHours ?? {}) },
    updatedAt: new Date().toISOString(),
  };
  const after = computeJourney(
    nextPlan.eventId,
    nextPlan.answers,
    nextPlan.statuses,
    nextPlan.elapsedHours,
  );
  const firedBefore = new Set(
    before.filter((node) => node.fired).map((node) => node.id),
  );
  const fired = after
    .filter((node) => node.fired && !firedBefore.has(node.id))
    .map((node) => node.id);

  return { plan: nextPlan, fired };
}

export function patchPlan(plan: Plan, patch: PlanPatch): PatchedPlan {
  const before = computeJourney(
    plan.eventId,
    plan.answers,
    plan.statuses,
    plan.elapsedHours ?? 0,
  );
  const target = before.find((node) => node.id === patch.nodeId);

  if (!target) {
    throw new Error(`Unknown plan node: ${patch.nodeId}`);
  }

  if (target.locked) {
    throw new Error(`Plan node is locked: ${patch.nodeId}`);
  }

  const nextPlan: Plan = {
    ...plan,
    statuses: { ...plan.statuses },
    acks: { ...plan.acks },
    syncEvents: [...plan.syncEvents],
    startedAtHours: { ...(plan.startedAtHours ?? {}) },
    updatedAt: new Date().toISOString(),
  };

  if (patch.status) {
    nextPlan.statuses[patch.nodeId] = patch.status;
    if (
      patch.status === "applied" &&
      nextPlan.startedAtHours?.[patch.nodeId] === undefined
    ) {
      nextPlan.startedAtHours![patch.nodeId] = nextPlan.elapsedHours ?? 0;
    }
  }

  if (patch.ack !== undefined) {
    nextPlan.acks[patch.nodeId] = patch.ack;
    nextPlan.statuses[patch.nodeId] = "done";
  }

  const after = computeJourney(
    nextPlan.eventId,
    nextPlan.answers,
    nextPlan.statuses,
    nextPlan.elapsedHours ?? 0,
  );
  const previouslyLocked = new Set(
    before.filter((node) => node.locked).map((node) => node.id),
  );
  const unlocked = after
    .filter((node) => previouslyLocked.has(node.id) && !node.locked)
    .map((node) => node.id);

  return { plan: nextPlan, unlocked };
}
