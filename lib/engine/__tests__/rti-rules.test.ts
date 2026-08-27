import { describe, expect, it } from "vitest";
import { listAuthorities, listAuthoritiesForLevel, matchAuthority, matchAuthorityWithReason } from "../authority";
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

    // A state filing is a different route, not an error, so the jurisdiction
    // check warns rather than blocks.
    expect(results.find((item) => item.id === "jurisdiction")?.status).toBe(
      "warn",
    );
    expect(results.find((item) => item.id === "jurisdiction")?.fix).toMatch(
      /file with your state/i,
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
      attachments: [
        { name: "first.pdf", type: "application/pdf", size: 600_000 },
        { name: "my attachment.pdf", type: "application/pdf", size: 400_000 },
      ],
      isBPL: "no",
      hasBplCertificate: false,
    });

    expect(results.find((item) => item.id === "charset")?.status).toBe("block");
    expect(results.find((item) => item.id === "attachment")?.status).toBe(
      "warn",
    );

    const combinedTooLarge = evaluatePreflightChecks({
      bodyLevel: "central",
      text: "Provide the file notings.",
      singleSubject: true,
      asksForRecords: true,
      hasIdentityDocuments: false,
      attachments: [
        { name: "first.pdf", type: "application/pdf", size: 600_000 },
        { name: "second.pdf", type: "application/pdf", size: 600_000 },
      ],
      isBPL: "no",
      hasBplCertificate: false,
    });
    expect(
      combinedTooLarge.find((item) => item.id === "attachment")?.status,
    ).toBe("warn");
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
      if (!authority.id.startsWith("unknown_")) {
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

describe("state public authorities", () => {
  it("offers a real list for a state filing", () => {
    const state = listAuthoritiesForLevel("state").filter(
      (item) => !item.id.startsWith("unknown_"),
    );
    // A state citizen previously got a select with no options at all.
    expect(state.length).toBeGreaterThanOrEqual(9);
    for (const authority of state) {
      expect(authority.officer).toBe("State Public Information Officer");
      expect(authority.records.length).toBeGreaterThan(0);
      expect(authority.officerNote.length).toBeGreaterThan(0);
    }
  });

  it("keeps the two governments separate", () => {
    const central = listAuthoritiesForLevel("central");
    const state = listAuthoritiesForLevel("state");
    expect(central.some((a) => a.level === "state")).toBe(false);
    expect(state.some((a) => a.level === "central")).toBe(false);
    for (const authority of central.filter((a) => !a.id.startsWith("unknown_"))) {
      expect(authority.officer).toBe("Central Public Information Officer");
    }
  });

  it("matches within the chosen government only", () => {
    expect(matchAuthorityWithReason("my FIR status", "state").authority.id).toBe("state_police");
    // The same words must not pull a state body into a central filing.
    expect(matchAuthorityWithReason("my FIR status", "central").authority.id).toBe("unknown_central");
  });

  it("names no individual office holder", () => {
    for (const authority of listAuthorities()) {
      expect(authority.officer).toMatch(/Information Officer$/);
      expect(authority.officerNote).not.toMatch(/\bMr\.?\b|\bMrs\.?\b|\bShri\b|\bSmt\b/);
    }
  });
});

describe("branching routes", () => {
  const base = { lifeLiberty: "no", isBPL: "no", wantsAction: "records" };

  it("uses the central submit node and drops the state one", () => {
    const ids = computeJourney("rti", { ...base, bodyLevel: "central" }).map((n) => n.id);
    expect(ids).toContain("submit");
    expect(ids).not.toContain("state_filing");
  });

  it("uses the state filing node and drops the central one", () => {
    const ids = computeJourney("rti", { ...base, bodyLevel: "state" }).map((n) => n.id);
    expect(ids).toContain("state_filing");
    expect(ids).not.toContain("submit");
  });

  it("a dependency on a node that does not apply is not a dependency", () => {
    // transfer_window, await_reply and the section 18 complaint list both
    // filing routes. Only one is ever present, and the case must not stall.
    const nodes = computeJourney(
      "rti",
      { ...base, bodyLevel: "state" },
      { jurisdiction_check: "done", identify_authority: "done", draft_request: "done", preflight: "done", state_filing: "done" },
      31 * 24,
    );
    expect(nodes.find((n) => n.id === "await_reply")?.locked).toBe(false);
    expect(nodes.find((n) => n.id === "deemed_refusal")?.fired).toBe(true);
    expect(nodes.find((n) => n.id === "first_appeal")?.locked).toBe(false);
  });

  it("runs the same statutory clocks on the state branch", () => {
    const state = computeJourney("rti", { ...base, bodyLevel: "state" });
    const central = computeJourney("rti", { ...base, bodyLevel: "central" });
    const days = (list: typeof state, id: string) =>
      list.find((n) => n.id === id)?.clock?.days;
    for (const id of ["await_reply", "first_appeal", "second_appeal"]) {
      expect(days(state, id)).toBe(days(central, id));
    }
  });

  it("no longer blocks a state filing at pre-flight", () => {
    const pack = loadRtiRulePack();
    expect(pack.checks.find((c) => c.id === "jurisdiction")?.level).toBe("warn");
  });
});
