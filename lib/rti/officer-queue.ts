import { computeJourney } from "@/lib/engine/journey";
import { listAuthorities } from "@/lib/engine/authority";
import type { RenderedNode } from "@/lib/engine/types";
import { replyClock, type ReplyClock } from "./reply-clock";

/**
 * The officer preview's queue.
 *
 * Six synthetic requests, every one of them run through the same engine and
 * the same rule pack as the citizen journey. Nothing here decides anything:
 * the current step, the clock and the deemed refusal all come back from
 * computeJourney, exactly as they do on a citizen's tracker.
 *
 * The subjects are invented. The authorities are ids from the authored
 * directory, so no office is named that the rule pack does not already carry.
 */
interface SyntheticRequest {
  /** Synthetic, in the registration format the portal uses. */
  registration: string;
  subject: string;
  authorityId: string;
  bodyLevel: "central" | "state";
  lifeLiberty: "yes" | "no";
  /** How long the request has been with the authority. */
  elapsedHours: number;
}

const requests: SyntheticRequest[] = [
  {
    registration: "DOPTR/E/2026/04417",
    subject: "Family pension arrears, sanction order and payment records",
    authorityId: "pension_central",
    bodyLevel: "central",
    lifeLiberty: "no",
    elapsedHours: 34 * 24,
  },
  {
    registration: "DOPTR/E/2026/04502",
    subject: "Provident fund transfer claim, file notings and status",
    authorityId: "epfo",
    bodyLevel: "central",
    lifeLiberty: "no",
    elapsedHours: 27 * 24,
  },
  {
    registration: "DOPTR/E/2026/04531",
    subject: "Hospital oxygen supply register for the night of 12 August",
    authorityId: "health_central",
    bodyLevel: "central",
    lifeLiberty: "yes",
    elapsedHours: 51,
  },
  {
    registration: "DOPTR/E/2026/04588",
    subject: "Ward road resurfacing work order, contractor and amount paid",
    authorityId: "municipal_corporation",
    bodyLevel: "state",
    lifeLiberty: "no",
    elapsedHours: 12 * 24,
  },
  {
    registration: "DOPTR/E/2026/04610",
    subject: "Answer sheet and evaluation record for the June examination",
    authorityId: "state_education",
    bodyLevel: "state",
    lifeLiberty: "no",
    elapsedHours: 25 * 24,
  },
  {
    registration: "DOPTR/E/2026/04644",
    subject: "Mutation entry and survey sketch for the disputed plot",
    authorityId: "land_records",
    bodyLevel: "state",
    lifeLiberty: "no",
    elapsedHours: 41 * 24,
  },
];

export type QueueStatus = "on_time" | "due_soon" | "overdue";

export interface QueueRow {
  registration: string;
  subject: string;
  authority: string;
  /** The step the engine says this request has reached. */
  currentNode: RenderedNode | undefined;
  clock: ReplyClock;
  lifeLiberty: boolean;
  status: QueueStatus;
  /** Silence has become a refusal in law under section 7(2). */
  pastDeemedRefusal: boolean;
  /** Hours left, used only for ordering. */
  hoursRemaining: number;
}

/** A week, in the unit each request is counted in. */
const DUE_SOON_DAYS = 7;

export function officerQueue(): QueueRow[] {
  const authorities = listAuthorities();
  const preFiled = ["jurisdiction_check", "identify_authority", "draft_request", "preflight"];

  const rows = requests.map((request): QueueRow => {
    const answers = {
      bodyLevel: request.bodyLevel,
      lifeLiberty: request.lifeLiberty,
      authorityId: request.authorityId,
    };
    const statuses = Object.fromEntries(
      [...preFiled, request.bodyLevel === "state" ? "state_filing" : "submit"].map(
        (id) => [id, "done" as const],
      ),
    );
    const nodes = computeJourney("rti", answers, statuses, request.elapsedHours);
    const clock = replyClock(request.elapsedHours, request.lifeLiberty === "yes");

    // The step the case is at, decided by the engine rather than by us, using
    // the same rule the citizen's tracker uses: a window that has already run
    // out is behind the case, not where it stands. Without that, a request
    // twelve days old reported the five day transfer window as its position.
    const isBehind = (node: RenderedNode) =>
      node.locked || node.lapsed || statuses[node.id] === "done";
    const currentNode =
      nodes.find((node) => node.fired && !node.locked) ??
      nodes.find((node) => !isBehind(node));

    const status: QueueStatus = clock.lapsed
      ? "overdue"
      : clock.remaining <= (request.lifeLiberty === "yes" ? DUE_SOON_DAYS * 24 : DUE_SOON_DAYS)
        ? "due_soon"
        : "on_time";

    const limitHours = request.lifeLiberty === "yes" ? 48 : 30 * 24;
    return {
      registration: request.registration,
      subject: request.subject,
      authority:
        authorities.find((item) => item.id === request.authorityId)?.name ??
        request.authorityId,
      currentNode,
      clock,
      lifeLiberty: request.lifeLiberty === "yes",
      status,
      pastDeemedRefusal: Boolean(nodes.find((node) => node.id === "deemed_refusal")?.fired),
      hoursRemaining: limitHours - request.elapsedHours,
    };
  });

  // Closest deadline first, so the one that runs out soonest is read first.
  return rows.sort((a, b) => a.hoursRemaining - b.hoursRemaining);
}

export interface QueueCounts {
  dueThisWeek: number;
  overdue: number;
  pastDeemedRefusal: number;
}

export function queueCounts(rows: QueueRow[]): QueueCounts {
  return {
    dueThisWeek: rows.filter((row) => row.status === "due_soon").length,
    overdue: rows.filter((row) => row.status === "overdue").length,
    pastDeemedRefusal: rows.filter((row) => row.pastDeemedRefusal).length,
  };
}
