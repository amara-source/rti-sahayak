import coreEntitlementsJson from "../../rules/entitlements/core.json";
import { isSkippedField } from "./conditions";
import type { Entitlement, Profile } from "./types";

const coreEntitlements = coreEntitlementsJson as unknown as Entitlement[];

export type EntitlementProfileField = keyof Profile;

const haqComparisonFields: readonly EntitlementProfileField[] = [
  "currentState",
  "category",
  "gender",
  "bpl",
  "hasDisability",
  "isSeniorCitizen",
  "residenceArea",
  "occupation",
  "employmentStatus",
  "minority",
  "dob",
  "parentsAges",
  "childrenAges",
  "homeState",
  "housing",
  "marital",
  "isSingleParent",
];

export function entitlementProfileFieldsFromRules(
  rules: readonly Entitlement[],
): EntitlementProfileField[] {
  const fields = new Set<EntitlementProfileField>();

  for (const rule of rules) {
    for (const condition of rule.appliesIf) {
      fields.add(condition.field as EntitlementProfileField);
    }

    if (rule.milestone) {
      fields.add(rule.milestone.field);
    }
  }

  return [...fields];
}

export function entitlementProfileFields(): EntitlementProfileField[] {
  return entitlementProfileFieldsFromRules(coreEntitlements);
}

export function haqProfileFields(): EntitlementProfileField[] {
  return [...haqComparisonFields];
}

export function missingEntitlementFields(
  profile: Profile,
  rules: readonly Entitlement[] = coreEntitlements,
): EntitlementProfileField[] {
  const facts = profile as Record<string, unknown>;

  return entitlementProfileFieldsFromRules(rules).filter((field) =>
    isSkippedField(facts, field),
  );
}
