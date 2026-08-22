import type { Condition } from "./types";

type Facts = Record<string, unknown>;

function hasValue(value: unknown): boolean {
  if (value === undefined || value === null || value === "") {
    return false;
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return true;
}

export function isSkippedField(facts: Facts, field: string): boolean {
  if (!Object.prototype.hasOwnProperty.call(facts, field)) {
    return true;
  }

  const value = facts[field];
  return value === undefined || value === null || value === "" || value === "NA";
}

export function conditionPasses(condition: Condition, facts: Facts): boolean {
  const actual = facts[condition.field];

  if (condition.op === "exists") {
    return hasValue(actual);
  }

  if (condition.op === "notExists") {
    return !hasValue(actual);
  }

  if (!hasValue(actual)) {
    return false;
  }

  switch (condition.op) {
    case "eq":
      return actual === condition.value;
    case "neq":
      return actual !== condition.value;
    case "in": {
      if (!Array.isArray(condition.value)) {
        return false;
      }

      const candidates = condition.value;

      if (Array.isArray(actual)) {
        return actual.some((value) => candidates.includes(String(value)));
      }

      return candidates.includes(String(actual));
    }
    case "gt":
      return typeof actual === "number" &&
        typeof condition.value === "number"
        ? actual > condition.value
        : false;
    case "lt":
      return typeof actual === "number" &&
        typeof condition.value === "number"
        ? actual < condition.value
        : false;
    case "gte":
      return typeof actual === "number" &&
        typeof condition.value === "number"
        ? actual >= condition.value
        : false;
    case "lte":
      return typeof actual === "number" &&
        typeof condition.value === "number"
        ? actual <= condition.value
        : false;
    default:
      return false;
  }
}

export function everyConditionPasses(
  conditions: readonly Condition[],
  facts: Facts,
): boolean {
  return conditions.every((condition) => conditionPasses(condition, facts));
}
