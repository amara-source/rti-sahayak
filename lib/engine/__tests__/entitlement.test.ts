import { describe, expect, it } from "vitest";
import {
  computeEntitlements,
  computeEntitlementsFromRules,
} from "../entitlement";
import type { Entitlement, Profile } from "../types";

const fixtureEntitlement: Entitlement = {
  id: "__milestone_fixture__",
  job: "DO",
  section: "available",
  title: "Milestone fixture",
  whyYouMayQualify: "Test fixture",
  whatItGives: "Test fixture",
  howToGet: [],
  authority: "Test authority",
  appliesIf: [],
  confidence: "verified",
  sourceLabel: "Test fixture",
  sourceUrl: "https://example.invalid",
  verifiedOn: "2026-08-22",
};

describe("computeEntitlements", () => {
  it("filters out answered fields that do not satisfy appliesIf", () => {
    const result = computeEntitlements({
      gender: "M",
      category: "general",
      childrenAges: [],
    });

    expect(result.entitlements).toEqual([]);
    expect(result.hiddenCount).toBe(0);
  });

  it("makes a skipped sensitive field reduce results without adding a wrong one", () => {
    const completeProfile: Profile = {
      gender: "F",
      category: "sc",
      childrenAges: [5],
    };
    const skippedCategory: Profile = {
      gender: "F",
      childrenAges: [5],
    };

    const complete = computeEntitlements(completeProfile);
    const skipped = computeEntitlements(skippedCategory);
    const completeIds = new Set(complete.entitlements.map((item) => item.id));

    expect(complete.entitlements).toHaveLength(3);
    expect(skipped.entitlements).toHaveLength(2);
    expect(skipped.hiddenCount).toBe(1);
    expect(skipped.entitlements.every((item) => completeIds.has(item.id))).toBe(
      true,
    );
    expect(skipped.entitlements.map((item) => item.id)).not.toContain(
      "legal_aid_categories",
    );
  });

  it("uses the authored section when no milestone is present", () => {
    const result = computeEntitlements({
      gender: "M",
      category: "general",
      childrenAges: [5],
    });

    expect(result.entitlements[0]?.id).toBe("immunisation");
    expect(result.entitlements[0]?.section).toBe("overdue");
  });

  it("marks a passed date-of-birth milestone overdue", () => {
    const rule: Entitlement = {
      ...fixtureEntitlement,
      milestone: { field: "dob", age: 18 },
    };

    const result = computeEntitlementsFromRules(
      [rule],
      { dob: "2007-09-01" },
      new Date("2026-08-22T00:00:00.000Z"),
    );

    expect(result.entitlements[0]?.section).toBe("overdue");
  });

  it("marks a milestone within twelve months upcoming", () => {
    const rule: Entitlement = {
      ...fixtureEntitlement,
      milestone: { field: "dob", age: 18 },
    };

    const result = computeEntitlementsFromRules(
      [rule],
      { dob: "2008-12-01" },
      new Date("2026-08-22T00:00:00.000Z"),
    );

    expect(result.entitlements[0]?.section).toBe("upcoming");
  });

  it("evaluates array milestones across every listed age", () => {
    const rule: Entitlement = {
      ...fixtureEntitlement,
      milestone: { field: "parentsAges", age: 60 },
    };

    const upcoming = computeEntitlementsFromRules(
      [rule],
      { parentsAges: [51, 59] },
      new Date("2026-08-22T00:00:00.000Z"),
    );
    const overdue = computeEntitlementsFromRules(
      [rule],
      { parentsAges: [61, 50] },
      new Date("2026-08-22T00:00:00.000Z"),
    );

    expect(upcoming.entitlements[0]?.section).toBe("upcoming");
    expect(overdue.entitlements[0]?.section).toBe("overdue");
  });

  it("orders sections consistently and places CLAIM first within a section", () => {
    const rules: Entitlement[] = [
      { ...fixtureEntitlement, id: "available-do", job: "DO" },
      { ...fixtureEntitlement, id: "available-claim", job: "CLAIM" },
      {
        ...fixtureEntitlement,
        id: "overdue-do",
        job: "DO",
        section: "overdue",
      },
      {
        ...fixtureEntitlement,
        id: "upcoming-claim",
        job: "CLAIM",
        section: "upcoming",
      },
    ];

    const result = computeEntitlementsFromRules(rules, {});

    expect(result.entitlements.map((item) => item.id)).toEqual([
      "overdue-do",
      "available-claim",
      "available-do",
      "upcoming-claim",
    ]);
  });
});
