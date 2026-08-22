import deathPackJson from "../../rules/events/death.json";
import jobLossPackJson from "../../rules/events/job-loss.json";
import movingStatePackJson from "../../rules/events/moving-state.json";
import { everyConditionPasses } from "./conditions";
import { topologicalSort } from "./topo";
import type {
  Bucket,
  EventRulePack,
  LoadedEventRulePack,
  RenderedNode,
  Status,
  Warning,
} from "./types";

const rawPacks = {
  death: deathPackJson,
  "job-loss": jobLossPackJson,
  "moving-state": movingStatePackJson,
} as const;

const bucketOrder: Record<Bucket, number> = {
  urgent: 0,
  before: 1,
  week1: 2,
  month: 3,
  later: 4,
};

function parseEventRulePack(pack: EventRulePack): LoadedEventRulePack {
  return {
    ...pack,
    nodes: pack.nodes.map((node) => ({ ...node, eventId: pack.eventId })),
  };
}

function rawEventRulePack(eventId: string): EventRulePack {
  const pack = rawPacks[eventId as keyof typeof rawPacks];

  if (!pack) {
    throw new Error(`Unknown event rule pack: ${eventId}`);
  }

  return pack as unknown as EventRulePack;
}

export function loadEventRulePack(eventId: string): LoadedEventRulePack {
  return parseEventRulePack(rawEventRulePack(eventId));
}

function visibleWarnings(
  warnings: readonly Warning[],
  answers: Record<string, unknown>,
): Warning[] {
  return warnings.flatMap((warning) => {
    if (warning.showIf && !everyConditionPasses(warning.showIf, answers)) {
      return [];
    }

    return [{ severity: warning.severity, text: warning.text }];
  });
}

export function computeJourneyFromPack(
  pack: EventRulePack,
  answers: Record<string, unknown>,
  statuses: Record<string, Status> = {},
): RenderedNode[] {
  const loadedPack = parseEventRulePack(pack);
  const applicableNodes = loadedPack.nodes.filter(
    (node) =>
      !(loadedPack.tier === 1 && node.confidence === "unverified") &&
      everyConditionPasses(node.appliesIf, answers),
  );
  const orderedNodes = topologicalSort(applicableNodes);

  return orderedNodes
    .map((node) => ({
      ...node,
      bucket:
        node.bucket === "before" && answers.when === "moved"
          ? ("urgent" as const)
          : node.bucket,
      locked: node.dependsOn.some(
        (dependencyId) => statuses[dependencyId] !== "done",
      ),
      warnings: visibleWarnings(node.warnings, answers),
    }))
    .sort((left, right) => bucketOrder[left.bucket] - bucketOrder[right.bucket]);
}

export function computeJourney(
  eventId: string,
  answers: Record<string, unknown>,
  statuses: Record<string, Status> = {},
): RenderedNode[] {
  return computeJourneyFromPack(rawEventRulePack(eventId), answers, statuses);
}
