import rtiPack from "../../rules/rti/journey.json";
import { everyConditionPasses } from "./conditions";
import type { Condition } from "./types";

export interface PreflightInput {
  bodyLevel: "central" | "state" | "unknown";
  text: string;
  singleSubject: boolean;
  asksForRecords: boolean;
  hasIdentityDocuments: boolean;
  attachment?: {
    name: string;
    type: string;
    size: number;
  };
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
        input.attachment === undefined ||
        (input.attachment.type === "application/pdf" &&
          input.attachment.size <= 1_048_576 &&
          !input.attachment.name.includes(" "))
      );
    case "bpl_certificate":
      return input.isBPL !== "yes" || input.hasBplCertificate;
    default:
      return false;
  }
}

export function evaluatePreflightChecks(
  input: PreflightInput,
): CheckResult[] {
  const checks = rtiPack.checks as Array<{
    id: string;
    level: "block" | "warn";
    label: string;
    fail: string;
    fix: string;
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
      label: check.label,
      fail: check.fail,
      fix: check.fix,
      status: (passes(check.id, input) ? "pass" : check.level) as CheckResult["status"],
    }));
}
