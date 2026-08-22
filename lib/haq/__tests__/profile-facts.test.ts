import { describe, expect, it } from "vitest";
import { profileFactForEntitlement } from "../profile-facts";
import type { Entitlement, Profile } from "../../engine/types";

const fixture: Entitlement = {
  id: "profile-fact-fixture",
  job: "CLAIM",
  section: "available",
  title: "Fixture",
  whyYouMayQualify: "The rule says this accurately.",
  whatItGives: "Fixture",
  howToGet: [],
  authority: "Fixture",
  appliesIf: [],
  confidence: "verified",
  sourceLabel: "Fixture",
  sourceUrl: "https://example.invalid",
  verifiedOn: "2026-08-22",
};

describe("profileFactForEntitlement", () => {
  it("renders the person's declared gender as their own fact", () => {
    const entitlement = {
      ...fixture,
      appliesIf: [{ field: "gender", op: "eq" as const, value: "F" }],
    };

    expect(profileFactForEntitlement(entitlement, { gender: "F" })).toBe(
      "You told us you are a woman.",
    );
  });

  it("renders the category that directly triggered the rule", () => {
    const entitlement = {
      ...fixture,
      appliesIf: [
        { field: "category", op: "in" as const, value: ["sc", "st"] },
      ],
    };

    expect(profileFactForEntitlement(entitlement, { category: "st" })).toBe(
      "You told us you selected Scheduled Tribe.",
    );
  });

  it("renders a direct household fact for a children-ages rule", () => {
    const entitlement = {
      ...fixture,
      appliesIf: [
        { field: "childrenAges", op: "exists" as const, value: "" },
      ],
    };

    expect(
      profileFactForEntitlement(entitlement, { childrenAges: [2, 8] }),
    ).toBe("You told us there are children aged 2 and 8 in your household.");
  });

  it("never infers a sensitive fact from an unrelated answer", () => {
    const entitlement = {
      ...fixture,
      appliesIf: [{ field: "gender", op: "eq" as const, value: "F" }],
    };
    const unrelatedProfile: Profile = {
      name: "Synthetic profile",
      currentDistrict: "Bengaluru Urban",
    };

    expect(profileFactForEntitlement(entitlement, unrelatedProfile)).toBeNull();
  });
});
