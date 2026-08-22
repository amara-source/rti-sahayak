import coreEntitlementsJson from "../../rules/entitlements/core.json";
import {
  conditionPasses,
  isSkippedField,
} from "./conditions";
import type {
  Entitlement,
  EntitlementResult,
  Profile,
} from "./types";

const coreEntitlements = coreEntitlementsJson as unknown as Entitlement[];

const sectionOrder: Record<Entitlement["section"], number> = {
  overdue: 0,
  available: 1,
  upcoming: 2,
};

function addUtcYears(date: Date, years: number): Date {
  const result = new Date(date);
  result.setUTCFullYear(result.getUTCFullYear() + years);
  return result;
}

function addUtcMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setUTCMonth(result.getUTCMonth() + months);
  return result;
}

function sectionForAge(
  currentAge: number,
  milestoneAge: number,
): Entitlement["section"] {
  if (currentAge >= milestoneAge) {
    return "overdue";
  }

  if (milestoneAge - currentAge <= 1) {
    return "upcoming";
  }

  return "available";
}

function resolveMilestoneSection(
  entitlement: Entitlement,
  profile: Profile,
  asOf: Date,
): Entitlement["section"] {
  const milestone = entitlement.milestone;

  if (!milestone) {
    return entitlement.section;
  }

  if (milestone.field === "dob") {
    if (!profile.dob) {
      return entitlement.section;
    }

    const dateOfBirth = new Date(`${profile.dob}T00:00:00.000Z`);
    if (Number.isNaN(dateOfBirth.getTime())) {
      return entitlement.section;
    }

    const thresholdDate = addUtcYears(dateOfBirth, milestone.age);
    if (thresholdDate <= asOf) {
      return "overdue";
    }

    return thresholdDate <= addUtcMonths(asOf, 12) ? "upcoming" : "available";
  }

  const ages = profile[milestone.field];
  if (!ages || ages.length === 0) {
    return entitlement.section;
  }

  const sections = ages
    .filter((age) => Number.isFinite(age))
    .map((age) => sectionForAge(age, milestone.age));

  if (sections.includes("overdue")) {
    return "overdue";
  }

  if (sections.includes("upcoming")) {
    return "upcoming";
  }

  return "available";
}

function profileFacts(profile: Profile): Record<string, unknown> {
  return { ...profile };
}

export function computeEntitlementsFromRules(
  rules: readonly Entitlement[],
  profile: Profile,
  asOf: Date = new Date(),
): EntitlementResult {
  const facts = profileFacts(profile);
  const entitlements: Entitlement[] = [];
  let hiddenCount = 0;

  for (const rule of rules) {
    if (rule.confidence === "unverified") {
      continue;
    }

    const referencesSkippedCondition = rule.appliesIf.some((condition) =>
      isSkippedField(facts, condition.field),
    );
    const referencesSkippedMilestone =
      rule.milestone !== undefined &&
      isSkippedField(facts, rule.milestone.field);

    if (referencesSkippedCondition || referencesSkippedMilestone) {
      hiddenCount += 1;
      continue;
    }

    if (!rule.appliesIf.every((condition) => conditionPasses(condition, facts))) {
      continue;
    }

    entitlements.push({
      ...rule,
      section: resolveMilestoneSection(rule, profile, asOf),
    });
  }

  entitlements.sort((left, right) => {
    const sectionDifference =
      sectionOrder[left.section] - sectionOrder[right.section];
    if (sectionDifference !== 0) {
      return sectionDifference;
    }

    if (left.job === right.job) {
      return 0;
    }

    return left.job === "CLAIM" ? -1 : right.job === "CLAIM" ? 1 : 0;
  });

  return { entitlements, hiddenCount };
}

export function computeEntitlements(
  profile: Profile,
  asOf: Date = new Date(),
): EntitlementResult {
  return computeEntitlementsFromRules(coreEntitlements, profile, asOf);
}
