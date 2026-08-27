export type Job = "DO" | "WAIT" | "CLAIM" | "PROTECT" | "ESCALATE";
export type Bucket = "before" | "now" | "next" | "later";
export type Confidence = "verified" | "conflicted" | "unverified";
export type Status = "none" | "applied" | "stuck" | "done";

export interface Condition {
  field: string;
  op:
    | "eq"
    | "neq"
    | "in"
    | "gt"
    | "lt"
    | "gte"
    | "lte"
    | "exists"
    | "notExists";
  value: string | number | boolean | string[];
}

export interface Warning {
  severity: "info" | "caution" | "critical";
  text: string;
  showIf?: Condition[];
}

export interface Clock {
  days: number;
  from: string;
  label: string;
  consequence: string;
}

export interface ClockOverride {
  hours: number;
  when: Condition[];
  label: string;
  consequence: string;
}

export interface ResolvedClock {
  days?: number;
  hours?: number;
  from: string;
  label: string;
  consequence: string;
}

export interface FiresWhen {
  node: string;
  state: "lapsed";
}

export interface RuleNode {
  id: string;
  eventId: string;
  job: Job;
  bucket: Bucket;
  title: string;
  summary: string;
  body: string;
  /**
   * The opening of body, word for word. What the person needs now, with the
   * rest of the same provision behind a disclosure.
   */
  lead?: string;
  /** Translations that live in the rule pack beside the English. */
  hi?: { title?: string; summary?: string; clockLabel?: string };
  appliesIf: Condition[];
  dependsOn: string[];
  authority: string;
  clock: Clock | null;
  clockOverrides?: ClockOverride[];
  firesWhen?: FiresWhen;
  /** When this node applies, the node it names does not. Used for branching routes. */
  replaces?: string;
  warnings: Warning[];
  generates?: string[];
  confidence: Confidence;
  sourceLabel: string;
  sourceUrl: string;
  verifiedOn: string;
}

export interface SyncEvent {
  nodeId: string;
  at: string;
  from: string;
  status: "received" | "in_progress" | "approved" | "rejected";
  message: string;
  simulated: true;
}

export interface Plan {
  code: string;
  eventId: string;
  answers: Record<string, unknown>;
  statuses: Record<string, Status>;
  acks: Record<string, string>;
  syncEvents: SyncEvent[];
  elapsedHours: number;
  startedAtHours?: Record<string, number>;
  lang: "en" | "hi" | "kn";
  createdAt: string;
  updatedAt: string;
}

export interface IntakeOption {
  v: string;
  label: string;
}

export interface IntakeQuestion {
  k: string;
  type?: "text" | "select";
  q: string;
  hint?: string;
  opts?: IntakeOption[];
  showIf?: Condition[];
}

export type PackedRuleNode = Omit<RuleNode, "eventId">;

export interface RtiRulePack {
  eventId: "rti";
  version: string;
  verifiedOn: string;
  label: string;
  _note: string;
  intake: IntakeQuestion[];
  nodes: PackedRuleNode[];
  checks: Array<{
    id: string;
    level: "block" | "warn";
    label: string;
    fail: string;
    fix: string;
    appliesIf?: Condition[];
  }>;
}

export interface LoadedRtiRulePack extends Omit<RtiRulePack, "nodes"> {
  nodes: RuleNode[];
}

export interface RenderedNode extends Omit<RuleNode, "clock"> {
  clock: ResolvedClock | null;
  locked: boolean;
  fired: boolean;
  /** This node's own clock has run past its statutory period. */
  lapsed: boolean;
}
