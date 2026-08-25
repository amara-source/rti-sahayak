import { describe, expect, it } from "vitest";
import { computeJourney } from "../journey";

function node(
  id: string,
  answers: Record<string, unknown> = {},
  statuses: Record<string, "none" | "applied" | "stuck" | "done"> = {},
  elapsedHours = 0,
) {
  return computeJourney("rti", answers, statuses, elapsedHours).find(
    (item) => item.id === id,
  );
}

describe("RTI journey rules", () => {
  it("fires deemed refusal on day 31 and not before", () => {
    expect(node("deemed_refusal", {}, { submit: "done" }, 30 * 24)?.fired).toBe(false);
    expect(node("deemed_refusal", {}, { submit: "done" }, 31 * 24)?.fired).toBe(true);
  });

  it("fires deemed refusal at 48 hours for life or liberty", () => {
    expect(node("deemed_refusal", { lifeLiberty: "yes" }, { submit: "done" }, 47)?.fired).toBe(false);
    expect(node("deemed_refusal", { lifeLiberty: "yes" }, { submit: "done" }, 48)?.fired).toBe(true);
  });

  it("keeps second appeal locked until first appeal is done", () => {
    expect(node("second_appeal", {}, { submit: "done" }, 31 * 24)?.locked).toBe(true);
    expect(node("second_appeal", {}, { submit: "done", first_appeal: "done" }, 31 * 24)?.locked).toBe(false);
  });

  it("keeps first appeal locked until deemed refusal fires", () => {
    expect(node("first_appeal", {}, { submit: "done" }, 30 * 24)?.locked).toBe(true);
    expect(node("first_appeal", {}, { submit: "done" }, 31 * 24)?.locked).toBe(false);
  });

  it("makes the section 18 complaint depend on submit, not the appeal chain", () => {
    expect(node("section_18_complaint")?.locked).toBe(true);
    expect(node("section_18_complaint", {}, { submit: "done" })?.locked).toBe(false);
  });

  it("resolves jurisdiction warnings for state and central bodies", () => {
    const stateWarnings = node("jurisdiction_check", { bodyLevel: "state" })?.warnings;
    const centralWarnings = node("jurisdiction_check", { bodyLevel: "central" })?.warnings;

    expect(stateWarnings).toHaveLength(1);
    expect(stateWarnings?.[0]?.severity).toBe("critical");
    expect(centralWarnings).toHaveLength(0);
  });

  it("keeps unknown jurisdiction as a caution", () => {
    const warnings = node("jurisdiction_check", {
      bodyLevel: "unknown",
    })?.warnings;

    expect(warnings).toHaveLength(1);
    expect(warnings?.[0]?.severity).toBe("caution");
  });

  it("applies not_an_rti only when the user wants action", () => {
    expect(node("not_an_rti", { wantsAction: "action" })).toBeDefined();
    expect(node("not_an_rti", { wantsAction: "records" })).toBeUndefined();
    expect(node("not_an_rti", { wantsAction: "status" })).toBeUndefined();
  });
});
