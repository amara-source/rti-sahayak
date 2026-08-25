import { describe, expect, it } from "vitest";
import { matchAuthority } from "../authority";
import { evaluatePreflightChecks } from "../checks";

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
