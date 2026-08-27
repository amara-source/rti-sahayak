import { describe, expect, it } from "vitest";
import { listAuthorities, matchAuthority, matchAuthorityWithReason } from "../authority";
import { evaluatePreflightChecks } from "../checks";
import { computeJourney } from "../journey";
import { listJurisdictions } from "../jurisdictions";
import { loadRtiRulePack } from "../journey";
import { homeCopy } from "../../../content/home-copy";

describe("RTI authority rules", () => {
  it("matches an authored central authority and falls back honestly", () => {
    expect(matchAuthority("My UAN provident fund transfer is pending").id).toBe(
      "epfo",
    );
    expect(matchAuthority("A subject that has no authored match").id).toBe(
      "unknown_central",
    );
  });

  it("matches meaningful individual words from an authored phrase", () => {
    expect(matchAuthority("My provident account record is pending").id).toBe(
      "epfo",
    );
    expect(matchAuthority("I need the cancelled ticket record").id).toBe(
      "railways",
    );
    expect(matchAuthority("A government record with no subject clue").id).toBe(
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

describe("RTI jurisdiction reference data", () => {
  it("lists all 28 states and 8 union territories, alphabetically", () => {
    const { states, unionTerritories } = listJurisdictions();

    expect(states).toHaveLength(28);
    expect(unionTerritories).toHaveLength(8);
    expect([...states].sort()).toEqual(states);
    expect([...unionTerritories].sort()).toEqual(unionTerritories);
  });

  it("keeps states and union territories separate", () => {
    const { states, unionTerritories } = listJurisdictions();

    expect(states).toContain("Karnataka");
    expect(states).not.toContain("Delhi, National Capital Territory");
    expect(unionTerritories).toContain("Delhi, National Capital Territory");
    expect(unionTerritories).toContain("Ladakh");
  });
});

describe("RTI authority pack completeness", () => {
  it("gives every real authority routing guidance and a record description", () => {
    for (const authority of listAuthorities()) {
      expect(authority.officerNote.length).toBeGreaterThan(0);
      if (authority.id !== "unknown_central") {
        expect(authority.records.length).toBeGreaterThan(0);
        expect(authority.ministry.length).toBeGreaterThan(0);
        expect(authority.matches.length).toBeGreaterThan(0);
      }
    }
  });

  it("names no individual officer, only designations", () => {
    for (const authority of listAuthorities()) {
      expect(authority.officer).toMatch(/Information Officer$/);
    }
  });

  it("reports which authored term produced the match", () => {
    const matched = matchAuthorityWithReason("my UAN provident fund transfer");
    expect(matched.authority.id).toBe("epfo");
    expect(matched.matchedTerm).toBeTruthy();

    const unmatched = matchAuthorityWithReason("something with no authored term");
    expect(unmatched.authority.id).toBe("unknown_central");
    expect(unmatched.matchedTerm).toBeNull();
  });
});

describe("home page traps stay tied to the rule pack", () => {
  it("names only checks the pack actually authors", () => {
    const authored = new Set(loadRtiRulePack().checks.map((check) => check.id));

    expect(homeCopy.traps.items).toHaveLength(9);
    for (const trap of homeCopy.traps.items) {
      const nodeIds = new Set(loadRtiRulePack().nodes.map((node) => node.id));
      expect(authored.has(trap.ruleId) || nodeIds.has(trap.ruleId)).toBe(true);
      expect(trap.basis.length).toBeGreaterThan(0);
    }
  });

  it("quotes no rupee figure other than the statutory fee", () => {
    const prose = [
      ...homeCopy.traps.items.flatMap((trap) => [trap.front, trap.back]),
      homeCopy.helpdesk.intro,
      homeCopy.helpdesk.disclaimer,
    ].join(" ");

    // Constraint 7: the only fee figures are the statutory ten rupee
    // application fee and the two rupee per page copying charge. "hundreds of
    // rupees" describes what middlemen charge, which is not a fee.
    const amounts =
      prose.match(
        /(?:₹\s?\d+|\b(?:one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+rupee)/gi,
      ) ?? [];
    for (const amount of amounts) {
      expect(amount.toLowerCase()).toMatch(/ten rupee|two rupee/);
    }
  });

  it("uses no em dash in user-facing copy", () => {
    const prose = JSON.stringify(homeCopy);
    expect(prose).not.toMatch(/[—–]/);
  });
});

describe("home journey strip stays tied to the rule pack", () => {
  it("keeps the clocks the strip reads its day counts from", () => {
    const pack = loadRtiRulePack();
    const days = (id: string) =>
      pack.nodes.find((node) => node.id === id)?.clock?.days;

    // If any of these move, the home page moves with them rather than lying.
    expect(days("await_reply")).toBe(30);
    expect(days("first_appeal")).toBe(30);
    expect(days("second_appeal")).toBe(90);
  });

  it("tells the same story in the same number of stages", () => {
    expect(homeCopy.journey.stages).toHaveLength(6);
    expect(homeCopy.journey.href).toBe("/example");
    expect(homeCopy.journey.stages.map((stage) => stage.id)).toEqual([
      "ask",
      "wait",
      "silence",
      "first",
      "decide",
      "second",
    ]);
  });
});

describe("authority outbound links", () => {
  it("gives every authority a link and a label", () => {
    for (const authority of listAuthorities()) {
      expect(authority.siteUrl, `no link for ${authority.id}`).toMatch(/^https:\/\//);
      expect(authority.siteLabel.length).toBeGreaterThan(0);
    }
  });

  it("only points at government hosts", () => {
    for (const authority of listAuthorities()) {
      const host = new URL(authority.siteUrl).hostname;
      expect(host.endsWith(".gov.in"), `${authority.id} -> ${host}`).toBe(true);
    }
  });
});
