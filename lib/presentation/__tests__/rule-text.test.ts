import { describe, expect, it } from "vitest";
import deathPack from "../../../rules/events/death.json";
import { citizenSafeRuleText } from "../rule-text";

describe("citizenSafeRuleText", () => {
  it("does not render citizen-paid fee references", () => {
    const node = deathPack.nodes.find((candidate) => candidate.id === "register_death");

    expect(citizenSafeRuleText(node?.summary ?? "")).not.toMatch(/fees?/i);
    expect(citizenSafeRuleText(node?.body ?? "")).not.toMatch(/fees?/i);
  });

  it("does not remove a non-monetary legal consequence", () => {
    const node = deathPack.nodes.find((candidate) => candidate.id === "vehicle_form31");
    const warning = node?.warnings[0]?.text ?? "";

    expect(citizenSafeRuleText(warning)).toContain("costs you the right");
  });
});
