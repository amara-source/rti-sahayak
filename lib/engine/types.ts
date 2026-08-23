export type Job = "DO" | "CLAIM" | "CLOSE" | "PROTECT" | "BELONG";
export type Bucket = "urgent" | "before" | "week1" | "month" | "later";
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
  label: string;
  days: number;
  from: "event_date" | "plan_created";
  consequence: string;
  sourceUrl: string;
}

export interface Resource {
  label: string;
  note: string;
  sourceUrl: string;
}

export interface RuleNode {
  id: string;
  eventId: string;
  job: Job;
  bucket: Bucket;
  title: string;
  summary: string;
  body: string;
  appliesIf: Condition[];
  dependsOn: string[];
  authority: string;
  typicalDays: string;
  documents: string[];
  warnings: Warning[];
  generates?: string[];
  belongResources?: Resource[];
  statutoryClock?: Clock | null;
  confidence: Confidence;
  sourceLabel: string;
  sourceUrl: string;
  verifiedOn: string;
}

export interface Entitlement {
  id: string;
  job: Job;
  section: "available" | "overdue" | "upcoming";
  title: string;
  whyYouMayQualify: string;
  whatItGives: string;
  howToGet: string[];
  authority: string;
  appliesIf: Condition[];
  warnings?: Warning[];
  milestone?: {
    field: "dob" | "parentsAges" | "childrenAges";
    age: number;
  };
  confidence: Confidence;
  sourceLabel: string;
  sourceUrl: string;
  verifiedOn: string;
}

export interface Profile {
  name?: string;
  aadhaarLast4?: string;
  dob?: string;
  gender?: "M" | "F" | "T" | "O" | "NA";
  currentState?: string;
  currentDistrict?: string;
  homeState?: string;
  homeDistrict?: string;
  incomeBand?: "<1L" | "1-3L" | "3-5L" | "5-8L" | "8L+" | "NA";
  employment?:
    | "salaried"
    | "gig"
    | "self"
    | "unorganised"
    | "student"
    | "none";
  marital?: "single" | "married" | "widowed" | "separated" | "NA";
  isSingleParent?: boolean | null;
  childrenAges?: number[];
  parentsAges?: number[];
  category?: "general" | "obc" | "pvtg" | "sc" | "st" | "NA";
  hasDisability?: boolean | null;
  housing?:
    | "own"
    | "rent-registered"
    | "rent-stamp"
    | "employer"
    | "family"
    | "NA";
  bpl?: boolean | null;
  isSeniorCitizen?: boolean | null;
  residenceArea?: "urban" | "rural" | "NA";
  occupation?:
    | "student"
    | "homemaker"
    | "farmer"
    | "wage-worker"
    | "professional"
    | "business"
    | "retired"
    | "other"
    | "NA";
  employmentStatus?:
    | "employed"
    | "self-employed"
    | "unemployed"
    | "student"
    | "retired"
    | "NA";
  minority?: boolean | null;
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
  lang: "en" | "hi" | "kn";
  createdAt: string;
  updatedAt: string;
}

export interface IntakeQuestion {
  k: string;
  q: string;
  opts: string[];
}

export type PackedRuleNode = Omit<RuleNode, "eventId">;

export interface EventRulePack {
  eventId: string;
  tier: 1 | 2;
  label: string;
  intake: IntakeQuestion[];
  nodes: PackedRuleNode[];
}

export interface LoadedEventRulePack extends Omit<EventRulePack, "nodes"> {
  nodes: RuleNode[];
}

export interface RenderedNode extends RuleNode {
  locked: boolean;
}

export interface EntitlementResult {
  entitlements: Entitlement[];
  hiddenCount: number;
}
