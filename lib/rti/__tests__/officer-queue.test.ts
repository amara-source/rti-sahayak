import { describe, expect, it } from "vitest";
import { officerQueue, queueCounts } from "../officer-queue";
import { listAuthorities } from "../../engine/authority";
import { replyClock } from "../reply-clock";

describe("the officer queue", () => {
  const rows = officerQueue();

  it("holds six synthetic requests", () => {
    expect(rows).toHaveLength(6);
  });

  it("orders them by closest deadline", () => {
    const remaining = rows.map((row) => row.hoursRemaining);
    expect([...remaining].sort((a, b) => a - b)).toEqual(remaining);
  });

  it("names only authorities the rule pack already carries", () => {
    const known = listAuthorities().map((authority) => authority.name);
    for (const row of rows) {
      expect(known, `${row.authority} is not in the directory`).toContain(row.authority);
    }
  });

  it("reads the current step from the rule pack rather than inventing one", () => {
    for (const row of rows) {
      expect(row.currentNode, `${row.registration} has no step`).toBeDefined();
      expect(row.currentNode!.title.length).toBeGreaterThan(0);
    }
  });

  it("agrees with the clock the citizen's tracker uses", () => {
    for (const row of rows) {
      const hours = row.lifeLiberty
        ? row.clock.elapsed
        : row.clock.elapsed * 24;
      expect(replyClock(hours, row.lifeLiberty).lapsed).toBe(row.clock.lapsed);
    }
  });

  it("counts overdue and deemed refusal from the engine, not by hand", () => {
    const counts = queueCounts(rows);
    expect(counts.overdue).toBe(rows.filter((row) => row.status === "overdue").length);
    // Silence past the reply period is a deemed refusal, so the two agree.
    expect(counts.pastDeemedRefusal).toBe(
      rows.filter((row) => row.pastDeemedRefusal).length,
    );
    expect(counts.overdue).toBeGreaterThan(0);
  });

  it("shows a life or liberty request counted in hours", () => {
    expect(rows.some((row) => row.lifeLiberty)).toBe(true);
  });

  it("never reports a window that has already run out as the current step", () => {
    for (const row of rows) {
      expect(row.currentNode!.lapsed, `${row.registration} is parked on a lapsed window`).toBe(false);
    }
  });

  it("puts a request past its reply period on the deemed refusal step", () => {
    for (const row of rows.filter((item) => item.pastDeemedRefusal)) {
      expect(row.currentNode!.id).toBe("deemed_refusal");
    }
  });
});
