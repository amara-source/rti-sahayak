import { describe, expect, it } from "vitest";
import type { SyncEvent } from "../../engine/types";
import { createPlan } from "../plan";
import { applySyncEvent, simulateSync } from "../sync";

const deathAnswers = {
  employment: "none",
  nominee: "yes",
  vehicle: "no",
  insurance: "no",
};

function event(
  status: SyncEvent["status"],
  nodeId = "register_death",
): SyncEvent {
  return {
    nodeId,
    at: "2026-08-23T10:00:00.000Z",
    from: "Municipal / state registrar",
    status,
    message: `Synthetic ${status} message`,
    simulated: true,
  };
}

describe("simulated department sync", () => {
  it("maps received and in-progress events to Applied", () => {
    const plan = createPlan("death", deathAnswers);
    const received = applySyncEvent(plan, event("received"));
    const inProgress = applySyncEvent(
      received.plan,
      event("in_progress"),
    );

    expect(received.plan.statuses.register_death).toBe("applied");
    expect(inProgress.plan.statuses.register_death).toBe("applied");
    expect(inProgress.plan.syncEvents).toHaveLength(2);
    expect(inProgress.plan.syncEvents.every((item) => item.simulated)).toBe(
      true,
    );
  });

  it("maps approval to Complete and unlocks dependents", () => {
    const plan = createPlan("death", deathAnswers);
    const result = applySyncEvent(plan, event("approved"));

    expect(result.plan.statuses.register_death).toBe("done");
    expect(result.unlocked).toContain("certificate_copies");
    expect(result.unlocked).toContain("bank_nominee");
  });

  it("maps rejection to Stuck without unlocking anything", () => {
    const plan = createPlan("death", deathAnswers);
    const result = applySyncEvent(plan, event("rejected"));

    expect(result.plan.statuses.register_death).toBe("stuck");
    expect(result.unlocked).toEqual([]);
  });

  it("pushes one to three immutable mock events from one explicit simulation", () => {
    const plan = createPlan("death", deathAnswers);
    const result = simulateSync(plan, new Date("2026-08-23T10:00:00.000Z"));

    expect(result.events).toHaveLength(3);
    expect(result.events.map((item) => item.status)).toEqual([
      "received",
      "in_progress",
      "approved",
    ]);
    expect(result.events.every((item) => item.simulated === true)).toBe(true);
    expect(result.events.every((item) => item.nodeId === "register_death")).toBe(
      true,
    );
    expect(result.plan.syncEvents).toEqual(result.events);
    expect(result.plan.statuses.register_death).toBe("done");
    expect(result.unlocked).toContain("certificate_copies");

    const approved = result.events.at(-1);
    expect(approved?.message).toContain("Order several certified copies");
    expect(approved?.message).toContain("Reply 1");
  });

  it("can produce a rejected simulation after the first successful unlock", () => {
    const plan = createPlan("death", deathAnswers);
    const first = simulateSync(plan, new Date("2026-08-23T10:00:00.000Z"));
    const second = simulateSync(
      first.plan,
      new Date("2026-08-23T10:05:00.000Z"),
    );

    expect(second.events).toHaveLength(2);
    expect(second.events.map((item) => item.status)).toEqual([
      "received",
      "rejected",
    ]);
    expect(second.plan.statuses.certificate_copies).toBe("stuck");
  });

  it("starts with a useful status message, never a welcome", () => {
    const plan = createPlan("death", deathAnswers);
    const result = simulateSync(plan, new Date("2026-08-23T10:00:00.000Z"));
    const firstMessage = result.events[0]?.message ?? "";

    expect(firstMessage).toMatch(/received/i);
    expect(firstMessage).toContain("Reply 1");
    expect(firstMessage).not.toMatch(/welcome/i);
  });
});
