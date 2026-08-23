import { describe, expect, it } from "vitest";
import { renderWhyYouMayQualify } from "../profile-facts";
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

describe("renderWhyYouMayQualify", () => {
  it("renders the JSON sentence as authored and interpolates a declared gender", () => {
    const entitlement = {
      ...fixture,
      whyYouMayQualify: "You told us you selected {{gender}}.",
      appliesIf: [{ field: "gender", op: "eq" as const, value: "F" }],
    };

    expect(renderWhyYouMayQualify(entitlement, { gender: "F" })).toBe(
      "You told us you selected Woman.",
    );
  });

  it("interpolates every placeholder in an authored sentence", () => {
    const entitlement = {
      ...fixture,
      whyYouMayQualify:
        "You declared {{category}} and answered {{hasDisability}} to disability.",
      appliesIf: [
        { field: "category", op: "in" as const, value: ["sc", "st"] },
        { field: "hasDisability", op: "eq" as const, value: true },
      ],
    };

    expect(
      renderWhyYouMayQualify(entitlement, {
        category: "st",
        hasDisability: true,
      }),
    ).toBe(
      "You declared Scheduled Tribe and answered Yes to disability.",
    );
  });

  it("formats age arrays without entitlement-specific phrasing", () => {
    const entitlement = {
      ...fixture,
      whyYouMayQualify:
        "You told us the children in your household are aged {{childrenAges}}.",
      appliesIf: [
        { field: "childrenAges", op: "exists" as const, value: "" },
      ],
    };

    expect(
      renderWhyYouMayQualify(entitlement, { childrenAges: [2, 8] }),
    ).toBe("You told us the children in your household are aged 2 and 8.");
  });

  it("leaves an authored sentence with no placeholder unchanged", () => {
    expect(renderWhyYouMayQualify(fixture, {})).toBe(
      "The rule says this accurately.",
    );
  });

  it("never fills a sensitive placeholder from an unrelated answer", () => {
    const entitlement = {
      ...fixture,
      whyYouMayQualify: "You told us you selected {{gender}}.",
      appliesIf: [{ field: "gender", op: "eq" as const, value: "F" }],
    };
    const unrelatedProfile: Profile = {
      name: "Synthetic profile",
      currentDistrict: "Bengaluru Urban",
    };

    expect(renderWhyYouMayQualify(entitlement, unrelatedProfile)).toBe(
      "You told us you selected {{gender}}.",
    );
  });
});
