import { describe, expect, it } from "vitest";
import { matchAuthority } from "../authority";
import { evaluatePreflightChecks } from "../checks";
import { computeJourney } from "../journey";

describe("RTI authority rules", () => {
  it("matches an authored central authority and falls back honestly", () => {
    expect(matchAuthority("My UAN provident fund transfer is pending").id).toBe(
      "epfo",
    );
    expect(matchAuthority("A subject that has no authored match").id).toBe(
      "unknown_central",
    );
  });
});

describe("RTI preflight rules", () => {
  it("blocks jurisdiction, length and required BPL evidence deterministically", () => {
    const results = evaluatePreflightChecks({
      bodyLevel: "state",
      text: "x".repeat(3_001),
      singleSubject: true,
      asksForRecords: true,
      hasIdentityDocuments: false,
      isBPL: "yes",
      hasBplCertificate: false,
    });

    expect(results.find((item) => item.id === "jurisdiction")?.status).toBe(
      "block",
    );
    expect(results.find((item) => item.id === "jurisdiction")?.fix).toMatch(
      /draft it anyway/i,
    );
    expect(results.find((item) => item.id === "length")?.status).toBe("block");
    expect(
      results.find((item) => item.id === "bpl_certificate")?.status,
    ).toBe("block");
  });

  it("warns without blocking for one-subject and records framing", () => {
    const results = evaluatePreflightChecks({
      bodyLevel: "central",
      text: "Provide the file notings.",
      singleSubject: false,
      asksForRecords: false,
      hasIdentityDocuments: false,
      isBPL: "no",
      hasBplCertificate: false,
    });

    expect(results.find((item) => item.id === "single_subject")?.status).toBe(
      "warn",
    );
    expect(
      results.find((item) => item.id === "asks_for_records")?.status,
    ).toBe("warn");
    expect(results.some((item) => item.status === "block")).toBe(false);
  });

  it("checks the authored character and attachment constraints", () => {
    const results = evaluatePreflightChecks({
      bodyLevel: "central",
      text: "Provide file notings — urgently.",
      singleSubject: true,
      asksForRecords: true,
      hasIdentityDocuments: false,
      attachment: {
        name: "my attachment.pdf",
        type: "application/pdf",
        size: 1_048_577,
      },
      isBPL: "no",
      hasBplCertificate: false,
    });

    expect(results.find((item) => item.id === "charset")?.status).toBe("block");
    expect(results.find((item) => item.id === "attachment")?.status).toBe(
      "warn",
    );
  });
});

describe("RTI clock state", () => {
  const answers = {
    bodyLevel: "central",
    lifeLiberty: "no",
    isBPL: "no",
    wantsAction: "records",
  };
  const submitted = {
    jurisdiction_check: "done",
    identify_authority: "done",
    draft_request: "done",
    preflight: "done",
    submit: "done",
  } as const;

  it("reports the reply window as lapsed once the statutory period runs out", () => {
    const inTime = computeJourney("rti", answers, { ...submitted }, 20 * 24);
    const overdue = computeJourney("rti", answers, { ...submitted }, 31 * 24);

    expect(inTime.find((node) => node.id === "await_reply")?.lapsed).toBe(false);
    expect(overdue.find((node) => node.id === "await_reply")?.lapsed).toBe(true);
  });

  it("keeps lapsed separate from fired so only the authored event fires", () => {
    const overdue = computeJourney("rti", answers, { ...submitted }, 31 * 24);
    const reply = overdue.find((node) => node.id === "await_reply");
    const deemed = overdue.find((node) => node.id === "deemed_refusal");

    expect(reply?.fired).toBe(false);
    expect(deemed?.fired).toBe(true);
    expect(deemed?.lapsed).toBe(false);
  });
});
