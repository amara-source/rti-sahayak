import type { IconName } from "@/components/rti/Icon";

/**
 * Concept to icon. One entry per thing the product talks about.
 *
 * The rule is not "one icon per component" but one icon per concept: a check
 * and the home page card describing the same check share their icon, because
 * they are the same idea. Two different concepts never share one.
 */

/** Rule pack journey nodes. */
export const nodeIcons: Record<string, IconName> = {
  jurisdiction_check: "compass",
  not_an_rti: "signpost",
  identify_authority: "building",
  draft_request: "document-pen",
  preflight: "clipboard-check",
  submit: "send",
  state_filing: "post-box",
  transfer_window: "transfer",
  await_reply: "clock",
  deemed_refusal: "bell-off",
  first_appeal: "escalate",
  second_appeal: "scales",
  section_18_complaint: "megaphone",
};

/** Pre-flight checks, and the home page traps that describe them. */
export const checkIcons: Record<string, IconName> = {
  jurisdiction: "map-pin",
  length: "text-length",
  charset: "keyboard",
  single_subject: "split",
  asks_for_records: "folder",
  no_identity_docs: "id-off",
  attachment: "paperclip",
  bpl_certificate: "certificate",
};

/** Public authorities in the directory. */
export const authorityIcons: Record<string, IconName> = {
  pension_central: "hand-coin",
  epfo: "wallet",
  esic: "heart-pulse",
  income_tax: "receipt",
  railways: "train",
  uidai: "fingerprint",
  passport: "passport",
  psu_bank: "bank",
  central_university: "graduation-cap",
  nsp_scholarship: "medal",
  health_central: "stethoscope",
  unknown_central: "question",
  // State public authorities.
  municipal_corporation: "city",
  state_police: "badge",
  state_transport: "bus",
  land_records: "map",
  state_treasury_pension: "vault",
  state_education: "blackboard",
  electricity_board: "bolt",
  water_board: "droplet",
  district_collector: "stamp",
  // Same concept as unknown_central, so deliberately the same glyph.
  unknown_state: "question",
};

/** Steps of the filing journey, keyed by route segment. */
export const stepIcons: Record<string, IconName> = {
  describe: "document-pen",
  jurisdiction: "compass",
  authority: "building",
  draft: "folder",
  checks: "clipboard-check",
  submit: "send",
  track: "timeline",
};

/** Cards that are not tied to a rule id. */
export const conceptIcons: Record<string, IconName> = {
  example: "route",
  file: "form",
  track: "timeline",
  law: "book",
  "two-websites": "two-windows",
  "paid-industry": "price-tag",
  "filing-is-easy": "hourglass",
  helpdesk: "lifebuoy",
};

export function nodeIcon(id: string): IconName {
  return nodeIcons[id] ?? "question";
}

export function checkIcon(id: string): IconName {
  return checkIcons[id] ?? "question";
}

export function authorityIcon(id: string): IconName {
  return authorityIcons[id] ?? "question";
}
