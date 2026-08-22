import { describe, expect, it } from "vitest";
import {
  computeJourney,
  computeJourneyFromPack,
} from "../journey";
import type { EventRulePack } from "../types";

describe("computeJourney", () => {
  it("filters nodes only when every appliesIf condition passes", () => {
    const nodes = computeJourney("death", {
      employment: "none",
      nominee: "yes",
      vehicle: "no",
      insurance: "no",
    });
    const ids = nodes.map((node) => node.id);

    expect(ids).toContain("bank_nominee");
    expect(ids).not.toContain("bank_no_nominee");
    expect(ids).not.toContain("epf_form20");
    expect(ids).not.toContain("vehicle_form31");
    expect(ids).not.toContain("insurance_claim");
  });

  it("injects eventId from the containing rule pack", () => {
    const nodes = computeJourney("job-loss", { esi: "no" });

    expect(nodes.length).toBeGreaterThan(0);
    expect(nodes.every((node) => node.eventId === "job-loss")).toBe(true);
  });

  it("reassigns before nodes to urgent after the move", () => {
    const pack: EventRulePack = {
      eventId: "__bucket_fixture__",
      tier: 1,
      label: "Bucket fixture",
      intake: [],
      nodes: [
        {
          id: "prepare",
          job: "DO",
          bucket: "before",
          title: "Prepare",
          summary: "Prepare before moving.",
          body: "Prepare before moving.",
          appliesIf: [],
          dependsOn: [],
          authority: "Test authority",
          typicalDays: "—",
          documents: [],
          warnings: [],
          confidence: "verified",
          sourceLabel: "Test fixture",
          sourceUrl: "https://example.invalid",
          verifiedOn: "2026-08-22",
        },
      ],
    };

    expect(
      computeJourneyFromPack(pack, { when: "moved" })[0]?.bucket,
    ).toBe("urgent");
    expect(
      computeJourneyFromPack(pack, { when: "soon" })[0]?.bucket,
    ).toBe("before");
  });

  it("locks a node until every dependency is done", () => {
    const initial = computeJourney("death", {
      employment: "none",
      nominee: "yes",
      vehicle: "no",
      insurance: "no",
    });
    const unlocked = computeJourney(
      "death",
      {
        employment: "none",
        nominee: "yes",
        vehicle: "no",
        insurance: "no",
      },
      { register_death: "done" },
    );

    expect(initial.find((node) => node.id === "certificate_copies")?.locked).toBe(
      true,
    );
    expect(unlocked.find((node) => node.id === "certificate_copies")?.locked).toBe(
      false,
    );
  });

  it("returns only conditional warnings whose showIf conditions pass", () => {
    const stampWarnings = computeJourney("moving-state", {
      housing: "stamp",
      work: "salaried",
      vehicle: "no",
    }).find((node) => node.id === "aadhaar_address")?.warnings;
    const registeredWarnings = computeJourney("moving-state", {
      housing: "registered",
      work: "salaried",
      vehicle: "no",
    }).find((node) => node.id === "aadhaar_address")?.warnings;

    expect(stampWarnings).toHaveLength(2);
    expect(registeredWarnings).toHaveLength(0);
  });
});
