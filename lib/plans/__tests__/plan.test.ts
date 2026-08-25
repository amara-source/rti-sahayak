import { describe, expect, it } from "vitest";
import { createPlan, patchPlan } from "../plan";

describe("plan lifecycle", () => {
  it("creates a six-character code with no vowels", () => {
    for (let index = 0; index < 100; index += 1) {
      const plan = createPlan("rti", {});

      expect(plan.code).toMatch(/^[B-DF-HJ-NP-TV-Z2-9]{6}$/);
    }
  });

  it("marks a referenced task done and reports newly unlocked dependents", () => {
    const plan = createPlan("rti", {});
    const result = patchPlan(plan, {
      nodeId: "jurisdiction_check",
      ack: "CONFIRMED",
    });

    expect(result.plan.statuses.jurisdiction_check).toBe("done");
    expect(result.plan.acks.jurisdiction_check).toBe("CONFIRMED");
    expect(result.unlocked).toContain("identify_authority");
  });

  it("updates status without completing a task", () => {
    const plan = createPlan("rti", {});
    const result = patchPlan(plan, {
      nodeId: "jurisdiction_check",
      status: "stuck",
    });

    expect(result.plan.statuses.jurisdiction_check).toBe("stuck");
    expect(result.unlocked).toEqual([]);
  });

  it("does not allow a locked task to be updated through the plan API layer", () => {
    const plan = createPlan("rti", {});

    expect(() =>
      patchPlan(plan, {
        nodeId: "draft_request",
        status: "applied",
      }),
    ).toThrow(/locked/i);
  });
});
