import { describe, expect, it } from "vitest";
import {
  entitlementProfileFields,
  entitlementProfileFieldsFromRules,
  missingEntitlementFields,
} from "../profile-fields";
import type { Entitlement, Profile } from "../types";

const fixture: Entitlement = {
  id: "profile-field-fixture",
  job: "CLAIM",
  section: "available",
  title: "Fixture",
  whyYouMayQualify: "Fixture",
  whatItGives: "Fixture",
  howToGet: [],
  authority: "Fixture",
  appliesIf: [],
  confidence: "verified",
  sourceLabel: "Fixture",
  sourceUrl: "https://example.invalid",
  verifiedOn: "2026-08-22",
};

describe("entitlement profile fields", () => {
  it("derives the current form from appliesIf and milestone data", () => {
    expect(entitlementProfileFields()).toEqual([
      "gender",
      "category",
      "childrenAges",
    ]);
  });

  it("makes dormant fields appear when a future rule starts using them", () => {
    const fields = entitlementProfileFieldsFromRules([
      {
        ...fixture,
        appliesIf: [
          { field: "incomeBand", op: "eq", value: "1-3L" },
          { field: "hasDisability", op: "eq", value: "true" },
        ],
        milestone: { field: "parentsAges", age: 60 },
      },
    ]);

    expect(fields).toEqual(["incomeBand", "hasDisability", "parentsAges"]);
  });

  it("preserves rule order while removing duplicate fields", () => {
    const fields = entitlementProfileFieldsFromRules([
      {
        ...fixture,
        appliesIf: [
          { field: "category", op: "eq", value: "sc" },
          { field: "gender", op: "eq", value: "F" },
        ],
      },
      {
        ...fixture,
        id: "second-fixture",
        appliesIf: [{ field: "category", op: "eq", value: "st" }],
      },
    ]);

    expect(fields).toEqual(["category", "gender"]);
  });

  it("returns only the exact unanswered rule fields", () => {
    const profile: Profile = {
      gender: "NA",
      category: "sc",
      childrenAges: [],
    };

    expect(missingEntitlementFields(profile)).toEqual(["gender"]);
  });
});
