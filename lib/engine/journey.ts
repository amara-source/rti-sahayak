import rtiPackJson from "../../rules/rti/journey.json";
import { everyConditionPasses } from "./conditions";
import { topologicalSort } from "./topo";
import type {
  Clock,
  LoadedRtiRulePack,
  RenderedNode,
  ResolvedClock,
  RtiRulePack,
  RuleNode,
  Status,
  Warning,
} from "./types";

const bucketOrder = {
  before: 0,
  now: 1,
  next: 2,
  later: 3,
} as const;

function parseRtiRulePack(pack: RtiRulePack): LoadedRtiRulePack {
  return {
    ...pack,
    nodes: pack.nodes.map((node) => ({ ...node, eventId: pack.eventId })),
  };
}

function rawRtiRulePack(eventId: string): RtiRulePack {
  if (eventId !== "rti") {
    throw new Error(`Unknown rule pack: ${eventId}`);
  }

  return rtiPackJson as unknown as RtiRulePack;
}

export function loadRtiRulePack(): LoadedRtiRulePack {
  return parseRtiRulePack(rawRtiRulePack("rti"));
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

function resolveClock(
  node: RuleNode,
  answers: Record<string, unknown>,
): ResolvedClock | null {
  const baseClock: Clock | null = node.clock;
  if (!baseClock) {
    return null;
  }

  const override = node.clockOverrides?.find((candidate) =>
    everyConditionPasses(candidate.when, answers),
  );

  if (override) {
    return {
      hours: override.hours,
      from: baseClock.from,
      label: override.label,
      consequence: override.consequence,
    };
  }

  return { ...baseClock };
}

function clockHasLapsed(
  clock: ResolvedClock | null,
  elapsedHoursSinceSubmission: number,
): boolean {
  if (!clock) {
    return false;
  }

  if (clock.hours !== undefined) {
    return elapsedHoursSinceSubmission >= clock.hours;
  }

  return clock.days !== undefined
    ? elapsedHoursSinceSubmission > clock.days * 24
    : false;
}

export function computeJourneyFromPack(
  pack: RtiRulePack,
  answers: Record<string, unknown>,
  statuses: Record<string, Status> = {},
  elapsedHoursSinceSubmission = 0,
): RenderedNode[] {
  const loadedPack = parseRtiRulePack(pack);
  const conditionallyApplicable = loadedPack.nodes.filter(
    (node) =>
      node.confidence !== "unverified" &&
      everyConditionPasses(node.appliesIf, answers),
  );
  // A node that applies can stand in for another, so the pack can branch: the
  // state filing step replaces the central submit step on that route.
  const replaced = new Set(
    conditionallyApplicable
      .map((node) => node.replaces)
      .filter((id): id is string => Boolean(id)),
  );
  const applicableNodes = conditionallyApplicable.filter(
    (node) => !replaced.has(node.id),
  );
  const orderedNodes = topologicalSort(applicableNodes);
  const resolvedClocks = new Map(
    orderedNodes.map((node) => [node.id, resolveClock(node, answers)]),
  );
  const applicableIdsForClocks = new Set(orderedNodes.map((node) => node.id));
  /**
   * A clock starts from the node named in `from`. Where that node does not
   * apply to this case, because the pack branches between the central and the
   * state filing route, the clock starts from whichever of the owning node's
   * dependencies actually applies and is done. The statutory period is the
   * same either way; only the counter it is filed at changes.
   */
  const clockHasStarted = (node: RuleNode, clock: ResolvedClock) => {
    if (applicableIdsForClocks.has(clock.from)) {
      return statuses[clock.from] === "done";
    }
    return node.dependsOn.some(
      (id) => applicableIdsForClocks.has(id) && statuses[id] === "done",
    );
  };

  const lapsedNodes = new Set(
    orderedNodes
      .filter((node) => {
        const clock = resolvedClocks.get(node.id) ?? null;
        return (
          clock !== null &&
          clockHasStarted(node, clock) &&
          clockHasLapsed(clock, elapsedHoursSinceSubmission)
        );
      })
      .map((node) => node.id),
  );
  const firedNodes = new Set(
    orderedNodes
      .filter(
        (node) =>
          node.firesWhen?.state === "lapsed" &&
          lapsedNodes.has(node.firesWhen.node),
      )
      .map((node) => node.id),
  );
  const applicableIds = new Set(orderedNodes.map((node) => node.id));
  // Same rule as the sort: a dependency that does not apply to this case is
  // not a dependency, so a branching route cannot leave the case stalled.
  const dependencyIsSatisfied = (id: string) =>
    !applicableIds.has(id) || statuses[id] === "done" || firedNodes.has(id);

  return orderedNodes
    .map((node) => {
      const fired = firedNodes.has(node.id);
      const locked = node.firesWhen
        ? !fired
        : node.dependsOn.some((id) => !dependencyIsSatisfied(id));

      return {
        ...node,
        clock: resolvedClocks.get(node.id) ?? null,
        locked,
        fired,
        lapsed: lapsedNodes.has(node.id),
        warnings: visibleWarnings(node.warnings, answers),
      };
    })
    .sort(
      (left, right) =>
        bucketOrder[left.bucket] - bucketOrder[right.bucket],
    );
}

export function computeJourney(
  eventId: string,
  answers: Record<string, unknown>,
  statuses: Record<string, Status> = {},
  elapsedHoursSinceSubmission = 0,
): RenderedNode[] {
  return computeJourneyFromPack(
    rawRtiRulePack(eventId),
    answers,
    statuses,
    elapsedHoursSinceSubmission,
  );
}
