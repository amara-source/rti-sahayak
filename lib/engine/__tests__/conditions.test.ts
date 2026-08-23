import { describe, expect, it } from "vitest";
import type { Condition } from "../types";
import { conditionPasses } from "../conditions";

describe("boolean conditions", () => {
  it("matches a declared true profile fact", () => {
    const condition: Condition = {
      field: "isSingleParent",
      op: "eq",
      value: true,
    };

    expect(conditionPasses(condition, { isSingleParent: true })).toBe(true);
    expect(conditionPasses(condition, { isSingleParent: false })).toBe(false);
  });

  it("matches a declared false profile fact without treating it as skipped", () => {
    const condition: Condition = {
      field: "hasDisability",
      op: "eq",
      value: false,
    };

    expect(conditionPasses(condition, { hasDisability: false })).toBe(true);
    expect(conditionPasses(condition, { hasDisability: true })).toBe(false);
  });
});
