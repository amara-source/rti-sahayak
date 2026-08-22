import { describe, expect, it } from "vitest";
import deathPack from "../../../rules/events/death.json";
import jobLossPack from "../../../rules/events/job-loss.json";
import movingStatePack from "../../../rules/events/moving-state.json";
import { drivenIntakeQuestions } from "../intake";
import type { EventRulePack } from "../types";

describe("drivenIntakeQuestions", () => {
  it("keeps only questions referenced by appliesIf or showIf", () => {
    expect(
      drivenIntakeQuestions(deathPack as unknown as EventRulePack).map(
        (question) => question.k,
      ),
    ).toEqual(["employment", "nominee", "vehicle", "insurance"]);

    expect(
      drivenIntakeQuestions(jobLossPack as unknown as EventRulePack).map(
        (question) => question.k,
      ),
    ).toEqual(["esi"]);

    expect(
      drivenIntakeQuestions(movingStatePack as unknown as EventRulePack).map(
        (question) => question.k,
      ),
    ).toEqual(["housing", "work", "vehicle"]);
  });

  it("automatically restores a dormant question when a future rule uses it", () => {
    const pack = structuredClone(
      movingStatePack,
    ) as unknown as EventRulePack;
    pack.nodes[0]?.appliesIf.push({
      field: "kids",
      op: "eq",
      value: "yes",
    });

    expect(
      drivenIntakeQuestions(pack).map((question) => question.k),
    ).toContain("kids");
  });

  it("preserves the authored question order", () => {
    expect(
      drivenIntakeQuestions(movingStatePack as unknown as EventRulePack).map(
        (question) => question.k,
      ),
    ).toEqual(["housing", "work", "vehicle"]);
  });
});
