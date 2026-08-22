import { haqCopy } from "../../content/haq-copy";
import { conditionPasses, isSkippedField } from "../engine/conditions";
import type { Entitlement, Profile } from "../engine/types";

function joinAges(ages: number[]): string {
  if (ages.length === 1) {
    return String(ages[0]);
  }

  return `${ages.slice(0, -1).join(", ")} and ${ages.at(-1)}`;
}

function directFact(field: string, value: unknown): string | null {
  if (field === "gender" && typeof value === "string" && value !== "NA") {
    return haqCopy.facts.gender[value as keyof typeof haqCopy.facts.gender] ?? null;
  }

  if (field === "category" && typeof value === "string" && value !== "NA") {
    return (
      haqCopy.facts.category[
        value as keyof typeof haqCopy.facts.category
      ] ?? null
    );
  }

  if (field === "childrenAges" && Array.isArray(value) && value.length > 0) {
    const ages = value.filter(
      (age): age is number => typeof age === "number" && Number.isFinite(age),
    );
    if (ages.length === 0) {
      return null;
    }

    return ages.length === 1
      ? haqCopy.facts.childrenOne(ages[0])
      : haqCopy.facts.childrenMany(joinAges(ages));
  }

  return null;
}

export function profileFactForEntitlement(
  entitlement: Entitlement,
  profile: Profile,
): string | null {
  const facts = profile as Record<string, unknown>;

  for (const condition of entitlement.appliesIf) {
    if (
      isSkippedField(facts, condition.field) ||
      !conditionPasses(condition, facts)
    ) {
      continue;
    }

    const fact = directFact(condition.field, facts[condition.field]);
    if (fact) {
      return fact;
    }
  }

  if (entitlement.milestone) {
    return directFact(
      entitlement.milestone.field,
      facts[entitlement.milestone.field],
    );
  }

  return null;
}
