import { trackerCopy } from "../../content/tracker-copy";
import { computeJourney } from "../engine/journey";
import type {
  Plan,
  RenderedNode,
  Status,
  SyncEvent,
} from "../engine/types";
import { patchPlan, type PatchedPlan } from "./plan";

const planStatusForSync: Record<SyncEvent["status"], Status> = {
  received: "applied",
  in_progress: "applied",
  approved: "done",
  rejected: "stuck",
};

export interface SimulatedSyncResult extends PatchedPlan {
  events: SyncEvent[];
}

export class NoSyncCandidateError extends Error {}

function appendEvent(result: PatchedPlan, event: SyncEvent): PatchedPlan {
  return {
    ...result,
    plan: {
      ...result.plan,
      syncEvents: [...result.plan.syncEvents, event],
      updatedAt: event.at,
    },
  };
}

export function applySyncEvent(
  plan: Plan,
  event: SyncEvent,
): PatchedPlan {
  return appendEvent(
    patchPlan(plan, {
      nodeId: event.nodeId,
      status: planStatusForSync[event.status],
    }),
    event,
  );
}

export function approveFiledTask(
  plan: Plan,
  nodeId: string,
  asOf: Date = new Date(),
): SimulatedSyncResult {
  const nodes = computeJourney(plan.eventId, plan.answers, plan.statuses);
  const target = nodes.find((node) => node.id === nodeId);

  if (!target) {
    throw new Error(`Task is not part of this plan: ${nodeId}`);
  }

  if (target.locked) {
    throw new Error(`Plan node is locked: ${nodeId}`);
  }

  const patched = patchPlan(plan, { nodeId, status: "done" });
  const nodesAfterApproval = computeJourney(
    patched.plan.eventId,
    patched.plan.answers,
    patched.plan.statuses,
  );
  const unlockedTitles = patched.unlocked.flatMap((unlockedId) => {
    const node = nodesAfterApproval.find(
      (candidate) => candidate.id === unlockedId,
    );
    return node ? [node.title] : [];
  });
  const event: SyncEvent = {
    nodeId,
    at: asOf.toISOString(),
    from: target.authority,
    status: "approved",
    message: messageFor("approved", target, unlockedTitles),
    simulated: true,
  };

  return {
    ...appendEvent(patched, event),
    events: [event],
  };
}

function firstSimulationTarget(
  nodes: readonly RenderedNode[],
): RenderedNode | undefined {
  const nodeIdsWithDependents = new Set(
    nodes.flatMap((node) => node.dependsOn),
  );

  return (
    nodes.find((node) => nodeIdsWithDependents.has(node.id)) ??
    nodes.find((node) => node.job === "CLAIM") ??
    nodes[0]
  );
}

function simulationTarget(
  plan: Plan,
  nodes: readonly RenderedNode[],
): RenderedNode | undefined {
  const available = nodes.filter((node) => {
    const status = plan.statuses[node.id] ?? "none";
    return !node.locked && status !== "done" && status !== "stuck";
  });

  if (plan.syncEvents.length === 0) {
    return firstSimulationTarget(available);
  }

  const syncedNodeIds = new Set(plan.syncEvents.map((event) => event.nodeId));

  return (
    available.find((node) => plan.statuses[node.id] === "applied") ??
    available.find((node) => !syncedNodeIds.has(node.id)) ??
    available[0]
  );
}

function simulatedStatuses(
  plan: Plan,
  target: RenderedNode,
): SyncEvent["status"][] {
  const existingStatus = plan.statuses[target.id] ?? "none";

  if (existingStatus === "applied") {
    const lastEvent = plan.syncEvents.findLast(
      (event) => event.nodeId === target.id,
    );

    return lastEvent?.status === "received"
      ? ["in_progress", "approved"]
      : ["approved"];
  }

  const distinctSyncedNodes = new Set(
    plan.syncEvents.map((event) => event.nodeId),
  ).size;

  if (distinctSyncedNodes === 0) {
    return ["received", "in_progress", "approved"];
  }

  return distinctSyncedNodes % 2 === 1
    ? ["received", "rejected"]
    : ["received", "in_progress"];
}

function messageFor(
  status: SyncEvent["status"],
  target: RenderedNode,
  unlockedTitles: readonly string[],
): string {
  switch (status) {
    case "received":
      return trackerCopy.message.received(target.authority, target.title);
    case "in_progress":
      return trackerCopy.message.inProgress(target.authority, target.title);
    case "approved":
      return trackerCopy.message.approved(target.title, unlockedTitles);
    case "rejected":
      return trackerCopy.message.rejected(target.authority, target.title);
  }
}

export function simulateSync(
  plan: Plan,
  asOf: Date = new Date(),
): SimulatedSyncResult {
  const initialNodes = computeJourney(plan.eventId, plan.answers, plan.statuses);
  const target = simulationTarget(plan, initialNodes);

  if (!target) {
    throw new NoSyncCandidateError(trackerCopy.api.noTasks);
  }

  const statuses = simulatedStatuses(plan, target);
  let currentPlan = plan;
  const events: SyncEvent[] = [];
  const unlockedIds = new Set<string>();

  for (const [index, status] of statuses.entries()) {
    const patched = patchPlan(currentPlan, {
      nodeId: target.id,
      status: planStatusForSync[status],
    });
    const nodesAfterEvent = computeJourney(
      patched.plan.eventId,
      patched.plan.answers,
      patched.plan.statuses,
    );
    const unlockedTitles = patched.unlocked.flatMap((nodeId) => {
      const node = nodesAfterEvent.find((candidate) => candidate.id === nodeId);
      return node ? [node.title] : [];
    });
    const at = new Date(asOf.getTime() + index * 1_000).toISOString();
    const event: SyncEvent = {
      nodeId: target.id,
      at,
      from: target.authority,
      status,
      message: messageFor(status, target, unlockedTitles),
      simulated: true,
    };
    const result = appendEvent(patched, event);

    currentPlan = result.plan;
    events.push(event);
    result.unlocked.forEach((nodeId) => unlockedIds.add(nodeId));
  }

  return {
    plan: currentPlan,
    events,
    unlocked: [...unlockedIds],
  };
}
