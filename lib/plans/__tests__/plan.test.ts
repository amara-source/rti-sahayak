import { describe, expect, it } from "vitest";
import { createPlan, patchPlan } from "../plan";

describe("plan lifecycle", () => {
  it("creates a six-character code with no vowels", () => {
    for (let index = 0; index < 100; index += 1) {
      const plan = createPlan("death", {});

      expect(plan.code).toMatch(/^[B-DF-HJ-NP-TV-Z2-9]{6}$/);
    }
  });

  it("marks a referenced task done and reports newly unlocked dependents", () => {
    const plan = createPlan("death", {
      employment: "none",
      nominee: "yes",
      vehicle: "no",
      insurance: "no",
    });
    const result = patchPlan(plan, {
      nodeId: "register_death",
      ack: "SYNTHETIC-REF-1",
    });

    expect(result.plan.statuses.register_death).toBe("done");
    expect(result.plan.acks.register_death).toBe("SYNTHETIC-REF-1");
    expect(result.unlocked).toContain("certificate_copies");
    expect(result.unlocked).toContain("bank_nominee");
  });

  it("updates status without completing a task", () => {
    const plan = createPlan("job-loss", { esi: "yes" });
    const result = patchPlan(plan, {
      nodeId: "abvky",
      status: "stuck",
    });

    expect(result.plan.statuses.abvky).toBe("stuck");
    expect(result.unlocked).toEqual([]);
  });
});
