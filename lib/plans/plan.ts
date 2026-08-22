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
    lang: "en",
    createdAt: now,
    updatedAt: now,
  };
}

export function patchPlan(plan: Plan, patch: PlanPatch): PatchedPlan {
  const before = computeJourney(plan.eventId, plan.answers, plan.statuses);
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
    updatedAt: new Date().toISOString(),
  };

  if (patch.status) {
    nextPlan.statuses[patch.nodeId] = patch.status;
  }

  if (patch.ack !== undefined) {
    nextPlan.acks[patch.nodeId] = patch.ack;
    nextPlan.statuses[patch.nodeId] = "done";
  }

  const after = computeJourney(
    nextPlan.eventId,
    nextPlan.answers,
    nextPlan.statuses,
  );
  const previouslyLocked = new Set(
    before.filter((node) => node.locked).map((node) => node.id),
  );
  const unlocked = after
    .filter((node) => previouslyLocked.has(node.id) && !node.locked)
    .map((node) => node.id);

  return { plan: nextPlan, unlocked };
}
