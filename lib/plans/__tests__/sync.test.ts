import { describe, expect, it } from "vitest";
import type { SyncEvent } from "../../engine/types";
import { createPlan } from "../plan";
import {
  applySyncEvent,
  approveFiledTask,
  simulateSync,
} from "../sync";

function event(
  status: SyncEvent["status"],
  nodeId = "jurisdiction_check",
): SyncEvent {
  return {
    nodeId,
    at: "2026-08-23T10:00:00.000Z",
    from: "Department of Personnel and Training",
    status,
    message: `Synthetic ${status} message`,
    simulated: true,
  };
}

describe("simulated department sync", () => {
  it("maps received and in-progress events to Applied", () => {
    const plan = createPlan("rti", {});
    const received = applySyncEvent(plan, event("received"));
    const inProgress = applySyncEvent(
      received.plan,
      event("in_progress"),
    );

    expect(received.plan.statuses.jurisdiction_check).toBe("applied");
    expect(inProgress.plan.statuses.jurisdiction_check).toBe("applied");
    expect(inProgress.plan.syncEvents).toHaveLength(2);
    expect(inProgress.plan.syncEvents.every((item) => item.simulated)).toBe(
      true,
    );
  });

  it("maps approval to Complete and unlocks dependents", () => {
    const plan = createPlan("rti", {});
    const result = applySyncEvent(plan, event("approved"));

    expect(result.plan.statuses.jurisdiction_check).toBe("done");
    expect(result.unlocked).toContain("identify_authority");
  });

  it("maps rejection to Stuck without unlocking anything", () => {
    const plan = createPlan("rti", {});
    const result = applySyncEvent(plan, event("rejected"));

    expect(result.plan.statuses.jurisdiction_check).toBe("stuck");
    expect(result.unlocked).toEqual([]);
  });

  it("pushes one to three immutable mock events from one explicit simulation", () => {
    const plan = createPlan("rti", {});
    const result = simulateSync(plan, new Date("2026-08-23T10:00:00.000Z"));

    expect(result.events).toHaveLength(3);
    expect(result.events.map((item) => item.status)).toEqual([
      "received",
      "in_progress",
      "approved",
    ]);
    expect(result.events.every((item) => item.simulated === true)).toBe(true);
    expect(result.events.every((item) => item.nodeId === "jurisdiction_check")).toBe(
      true,
    );
    expect(result.plan.syncEvents).toEqual(result.events);
    expect(result.plan.statuses.jurisdiction_check).toBe("done");
    expect(result.unlocked).toContain("identify_authority");

    const approved = result.events.at(-1);
    expect(approved?.message).toContain("Find the right public authority");
    expect(approved?.message).toContain("Reply 1");
  });

  it("can produce a rejected simulation after the first successful unlock", () => {
    const plan = createPlan("rti", {});
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
    expect(second.plan.statuses.identify_authority).toBe("stuck");
  });

  it("starts with a useful status message, never a welcome", () => {
    const plan = createPlan("rti", {});
    const result = simulateSync(plan, new Date("2026-08-23T10:00:00.000Z"));
    const firstMessage = result.events[0]?.message ?? "";

    expect(firstMessage).toMatch(/received/i);
    expect(firstMessage).toContain("Reply 1");
    expect(firstMessage).not.toMatch(/welcome/i);
  });

  it("approves the exact task a citizen says they filed", () => {
    const plan = createPlan("rti", {});
    const applied = applySyncEvent(plan, event("received"));
    const result = approveFiledTask(
      applied.plan,
      "jurisdiction_check",
      new Date("2026-08-23T10:00:02.000Z"),
    );

    expect(result.events).toHaveLength(1);
    expect(result.events[0]).toMatchObject({
      nodeId: "jurisdiction_check",
      status: "approved",
      simulated: true,
    });
    expect(result.plan.statuses.jurisdiction_check).toBe("done");
    expect(result.unlocked).toContain("identify_authority");
    expect(result.events[0]?.message).toContain("Reply 1");
  });

  it("will not approve a different or locked task through the return flow", () => {
    const plan = createPlan("rti", {});

    expect(() =>
      approveFiledTask(plan, "draft_request"),
    ).toThrow(/locked/i);
    expect(() => approveFiledTask(plan, "not-in-this-plan")).toThrow(
      /not part of this plan/i,
    );
  });
});
