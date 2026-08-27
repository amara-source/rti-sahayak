import rtiPack from "../../rules/rti/journey.json";
import { everyConditionPasses } from "./conditions";
import type { Condition } from "./types";

export interface PreflightInput {
  bodyLevel: "central" | "state" | "unknown";
  text: string;
  singleSubject: boolean;
  asksForRecords: boolean;
  hasIdentityDocuments: boolean;
  attachments?: Array<{
    name: string;
    type: string;
    size: number;
  }>;
  isBPL: "yes" | "no" | "na";
  hasBplCertificate: boolean;
}

export interface CheckResult {
  id: string;
  label: string;
  status: "pass" | "warn" | "block";
  fail: string;
  fix: string;
}

const allowedCharacters = /^[A-Za-z0-9,\.\-_()\/@:&?\\%\s]*$/;

function passes(id: string, input: PreflightInput): boolean {
  switch (id) {
    case "jurisdiction":
      return input.bodyLevel === "central";
    case "length":
      return input.text.length <= 3_000;
    case "charset":
      return allowedCharacters.test(input.text);
    case "single_subject":
      return input.singleSubject;
    case "asks_for_records":
      return input.asksForRecords;
    case "no_identity_docs":
      return !input.hasIdentityDocuments;
    case "attachment":
      return (
        input.attachments === undefined ||
        (input.attachments.reduce((total, item) => total + item.size, 0) <= 1_048_576 &&
          input.attachments.every(
            (item) =>
              item.type === "application/pdf" && !item.name.includes(" "),
          ))
      );
    case "bpl_certificate":
      return input.isBPL !== "yes" || input.hasBplCertificate;
    default:
      return false;
  }
}

/**
 * The wording a check shows, in the language asked for.
 *
 * The translation lives in the rule pack beside the English, so check content
 * still comes only from /rules. A missing translation falls through to
 * English rather than rendering half a sentence in each language.
 */
type CheckWording = { label: string; fail: string; fix: string };

function wording(
  check: CheckWording & { hi?: Partial<CheckWording> },
  language: string,
): CheckWording {
  const patch = language === "hi" ? check.hi : undefined;
  if (!patch) return { label: check.label, fail: check.fail, fix: check.fix };
  return {
    label: patch.label ?? check.label,
    fail: patch.fail ?? check.fail,
    fix: patch.fix ?? check.fix,
  };
}

export function evaluatePreflightChecks(
  input: PreflightInput,
  language = "en",
): CheckResult[] {
  const checks = rtiPack.checks as Array<{
    id: string;
    level: "block" | "warn";
    label: string;
    fail: string;
    fix: string;
    hi?: Partial<CheckWording>;
    appliesIf?: Condition[];
  }>;

  return checks
    .filter((check) =>
      everyConditionPasses(
        check.appliesIf ?? [],
        input as unknown as Record<string, unknown>,
      ),
    )
    .map((check) => ({
      id: check.id,
      ...wording(check, language),
      status: (passes(check.id, input) ? "pass" : check.level) as CheckResult["status"],
    }));
}
