"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { rtiCopy } from "@/content/rti-copy";
import { PageHero, type HeroTone } from "@/components/rti/PageHero";
import { listAuthorities, matchAuthorityWithReason } from "@/lib/engine/authority";
import { listJurisdictions } from "@/lib/engine/jurisdictions";
import { digitsOnly, passesVerhoeff, synthesiseInvalidAadhaar } from "@/lib/rti/verhoeff";
import { Icon } from "./Icon";
import { authorityIcon, checkIcon, stepIcons } from "@/lib/rti/icon-map";
import { JourneyProgress, type JourneyProgressStep } from "./JourneyProgress";
import {
  evaluatePreflightChecks,
  type PreflightInput,
} from "@/lib/engine/checks";
import { computeJourney } from "@/lib/engine/journey";
import {
  loadDraft,
  saveDraft,
  type RewriteChange,
  type RtiDraft,
} from "@/lib/rti/draft";

type Step = "describe" | "jurisdiction" | "authority" | "draft" | "checks" | "submit";

const checkFixHrefs: Record<string, string> = {
  jurisdiction: "/file/jurisdiction#government-type",
  length: "/file/draft#filing-text",
  charset: "/file/draft#filing-text",
  single_subject: "/file/draft#filing-text",
  asks_for_records: "/file/draft#filing-text",
  no_identity_docs: "/file/checks#identity-documents",
  attachment: "/file/checks#attachment",
  bpl_certificate: "/file/checks#bpl-certificate",
};

const heroByEyebrow: Record<
  string,
  { illustration: string; supporting: string; tone: HeroTone }
> = {
  [rtiCopy.describe.eyebrow]: {
    illustration: "/illustrations/describe.png",
    supporting: rtiCopy.describe.intro,
    tone: "blue",
  },
  [rtiCopy.jurisdiction.eyebrow]: {
    illustration: "/illustrations/jurisdiction.png",
    supporting: rtiCopy.jurisdiction.bodyLevel,
    tone: "teal",
  },
  [rtiCopy.authority.eyebrow]: {
    illustration: "/illustrations/authority.png",
    supporting: rtiCopy.authority.directory,
    tone: "orange",
  },
  [rtiCopy.draft.eyebrow]: {
    illustration: "/illustrations/draft.png",
    supporting: rtiCopy.draft.changes,
    tone: "violet",
  },
  [rtiCopy.checks.eyebrow]: {
    illustration: "/illustrations/checks.png",
    supporting: rtiCopy.checks.intro,
    tone: "teal",
  },
  [rtiCopy.submit.eyebrow]: {
    illustration: "/illustrations/submit.png",
    supporting: rtiCopy.submit.label,
    tone: "blue",
  },
};

function useStoredDraft() {
  const [draft, setDraftState] = useState<RtiDraft | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- browser-only storage and matchMedia can only be read after mount. This previously ran inside requestAnimationFrame, which never fires in a hidden tab and left the page blank.
    setDraftState(loadDraft());
    setReady(true);
  }, []);

  function update(next: RtiDraft) {
    saveDraft(next);
    setDraftState(next);
  }

  return { draft, ready, update };
}

function Shell({
  eyebrow,
  heading,
  step,
  children,
}: {
  step?: Exclude<JourneyProgressStep, "track">;
  eyebrow: string;
  heading: string;
  children: React.ReactNode;
}) {
  const hero = heroByEyebrow[eyebrow] ?? heroByEyebrow[rtiCopy.describe.eyebrow];
  return (
    <section className="rti-flow-page">
      <PageHero
        eyebrow={eyebrow}
        illustration={hero.illustration}
        supporting={hero.supporting}
        title={heading}
        tone={hero.tone}
      />
      <div className="rti-flow-shell rti-overlap-card">
        {step ? <JourneyProgress current={step} /> : null}
        {step ? <span className="rti-icon-tile"><Icon name={stepIcons[step]} /></span> : null}
        {children}
      </div>
    </section>
  );
}

function DescribeStep() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [subject, setSubject] = useState("");
  const [summary, setSummary] = useState("");
  const [wantsAction, setWantsAction] =
    useState<NonNullable<RtiDraft["wantsAction"]>>("records");
  const [lifeLiberty, setLifeLiberty] = useState<"yes" | "no">("no");
  const [isBPL, setIsBPL] = useState<"yes" | "no" | "na">("no");
  const [confirming, setConfirming] = useState(false);
  const [pending, setPending] = useState(false);
  const [degraded, setDegraded] = useState(false);

  async function extract() {
    if (!text.trim()) return;
    setPending(true);
    try {
      const response = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const result = (await response.json()) as {
        extracted?: { subject?: string; summary?: string };
        degraded?: boolean;
      };
      setSubject(result.extracted?.subject?.trim() || text.trim());
      setSummary(result.extracted?.summary?.trim() || text.trim());
      setDegraded(Boolean(result.degraded));
    } catch {
      setSubject(text.trim());
      setSummary(text.trim());
      setDegraded(true);
    } finally {
      setConfirming(true);
      setPending(false);
    }
  }

  function confirm() {
    const draft: RtiDraft = {
      rawText: text.trim(),
      subject: subject.trim() || text.trim(),
      confirmed: true,
      wantsAction,
      lifeLiberty,
      isBPL,
    };
    saveDraft(draft);
    router.push("/file/jurisdiction");
  }

  return (
    <Shell step="describe" eyebrow={rtiCopy.describe.eyebrow} heading={rtiCopy.describe.heading}>
      <label className="rti-field">
        <span>{rtiCopy.describe.original}</span>
        <textarea
          autoFocus
          onChange={(event) => setText(event.target.value)}
          placeholder={rtiCopy.describe.placeholder}
          rows={8}
          value={text}
        />
      </label>
      <section className="rti-template-picker">
        <h2>{rtiCopy.describe.templatesHeading}</h2>
        <p>{rtiCopy.describe.templatesNote}</p>
        <div className="rti-template-chips">
          {rtiCopy.describe.templates.map((template) => (
            <button
              aria-pressed={text === template.text}
              className={text === template.text ? "is-selected" : undefined}
              key={template.label}
              onClick={() => setText(template.text)}
              type="button"
            >
              <strong>{template.label}</strong>
              <span>{template.text}</span>
            </button>
          ))}
        </div>
      </section>
      {!confirming ? (
        <>
          <button
            className="rti-primary"
            disabled={!text.trim() || pending}
            onClick={extract}
            type="button"
          >
            {pending ? rtiCopy.common.loading : rtiCopy.describe.submitAction}
          </button>
          {!text.trim() ? <p className="rti-disabled-reason">{rtiCopy.describe.disabledReason}</p> : null}
        </>
      ) : null}

      {confirming ? (
        <section className="rti-confirmation" aria-live="polite">
          <h2>{rtiCopy.describe.confirmation}</h2>
          <p><strong>{rtiCopy.describe.youSaid}:</strong> {summary}</p>
          {degraded ? <p className="rti-note">{rtiCopy.common.error}</p> : null}
          <label className="rti-field">
            <span>{rtiCopy.describe.subject}</span>
            <textarea
              onChange={(event) => setSubject(event.target.value)}
              rows={4}
              value={subject}
            />
          </label>
          <label className="rti-field">
            <span>{rtiCopy.describe.wantsAction}</span>
            <select
              onChange={(event) =>
                setWantsAction(event.target.value as typeof wantsAction)
              }
              value={wantsAction}
            >
              <option value="records">{rtiCopy.describe.records}</option>
              <option value="status">{rtiCopy.describe.status}</option>
              <option value="decision">{rtiCopy.describe.decision}</option>
              <option value="recorded_reasons">{rtiCopy.describe.recordedReasons}</option>
              <option value="inspection">{rtiCopy.describe.inspection}</option>
              <option value="spending">{rtiCopy.describe.spending}</option>
              <option value="action">{rtiCopy.describe.actionOption}</option>
            </select>
          </label>
          <div className="rti-inline-fields">
            <label className="rti-field">
              <span>{rtiCopy.describe.lifeLiberty}</span>
              <select
                onChange={(event) =>
                  setLifeLiberty(event.target.value as typeof lifeLiberty)
                }
                value={lifeLiberty}
              >
                <option value="no">{rtiCopy.describe.no}</option>
                <option value="yes">{rtiCopy.describe.yes}</option>
              </select>
            </label>
            <label className="rti-field">
              <span>{rtiCopy.describe.bpl}</span>
              <select
                onChange={(event) => setIsBPL(event.target.value as typeof isBPL)}
                value={isBPL}
              >
                <option value="no">{rtiCopy.describe.no}</option>
                <option value="yes">{rtiCopy.describe.yes}</option>
                <option value="na">{rtiCopy.describe.preferNot}</option>
              </select>
            </label>
          </div>
          <button className="rti-primary" onClick={confirm} type="button">
            {rtiCopy.describe.confirm}
          </button>
        </section>
      ) : null}
    </Shell>
  );
}

function JurisdictionStep() {
  const router = useRouter();
  const { draft, ready, update } = useStoredDraft();
  const [bodyLevel, setBodyLevel] =
    useState<"central" | "state" | "unknown">("unknown");
  const [state, setState] = useState("");
  const jurisdictions = useMemo(() => listJurisdictions(), []);

  useEffect(() => {
    if (!draft) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- browser-only storage and matchMedia can only be read after mount. This previously ran inside requestAnimationFrame, which never fires in a hidden tab and left the page blank.
    setBodyLevel(draft.bodyLevel ?? "unknown");
    setState(draft.state ?? "");
  }, [draft]);

  if (!ready) return null;
  if (!draft) return <Shell step="jurisdiction" eyebrow={rtiCopy.jurisdiction.eyebrow} heading={rtiCopy.jurisdiction.heading}><Link href="/file">{rtiCopy.common.back}</Link></Shell>;

  const warning = computeJourney("rti", { bodyLevel }).find(
    (node) => node.id === "jurisdiction_check",
  )?.warnings[0];
  const needsState = bodyLevel !== "central";

  function proceed(draftOnly: boolean) {
    const changed = draft!.bodyLevel !== bodyLevel || draft!.state !== state;
    update({
      ...draft!,
      bodyLevel,
      state,
      draftOnly,
      ...(changed
        ? {
            authorityId: undefined,
            authorityName: undefined,
            officer: undefined,
            rewritten: undefined,
            changes: undefined,
            singleSubject: undefined,
            asksForRecords: undefined,
            hasIdentityDocuments: undefined,
            attachment: undefined,
            hasBplCertificate: undefined,
          }
        : {}),
    });
    router.push("/file/authority");
  }

  return (
    <Shell step="jurisdiction" eyebrow={rtiCopy.jurisdiction.eyebrow} heading={rtiCopy.jurisdiction.heading}>
      <fieldset className="rti-choice-group" id="government-type">
        <legend>{rtiCopy.jurisdiction.bodyLevel}</legend>
        {([
          ["central", rtiCopy.jurisdiction.central],
          ["state", rtiCopy.jurisdiction.state],
          ["unknown", rtiCopy.jurisdiction.unknown],
        ] as const).map(([value, label]) => (
          <label key={value}>
            <input
              checked={bodyLevel === value}
              name="bodyLevel"
              onChange={() => setBodyLevel(value)}
              type="radio"
            />
            <span>{label}</span>
          </label>
        ))}
      </fieldset>
      {needsState ? (
        <label className="rti-field rti-state-field">
          <span>{rtiCopy.jurisdiction.stateLabel}</span>
          <select onChange={(event) => setState(event.target.value)} value={state}>
            <option value="">{rtiCopy.jurisdiction.statePlaceholder}</option>
            <optgroup label={rtiCopy.jurisdiction.statesGroup}>
              {jurisdictions.states.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </optgroup>
            <optgroup label={rtiCopy.jurisdiction.unionTerritoriesGroup}>
              {jurisdictions.unionTerritories.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </optgroup>
          </select>
        </label>
      ) : null}
      {warning ? (
        <div className={`rti-warning rti-warning--${warning.severity}`}>
          <strong>{warning.text}</strong>
          {bodyLevel === "unknown" ? <p>{rtiCopy.jurisdiction.helper}</p> : null}
        </div>
      ) : null}
      <div className="rti-actions">
        {bodyLevel === "central" ? (
          <button className="rti-primary" onClick={() => proceed(false)} type="button">
            {rtiCopy.common.continue}
          </button>
        ) : (
          <>
            <button
              className="rti-primary"
              disabled={!state.trim()}
              onClick={() => proceed(true)}
              type="button"
            >
              {rtiCopy.jurisdiction.draftAnyway}
            </button>
            <small>{rtiCopy.jurisdiction.resolveFirst}</small>
          </>
        )}
      </div>
    </Shell>
  );
}

function AuthorityStep() {
  const router = useRouter();
  const { draft, ready, update } = useStoredDraft();
  const [authorityId, setAuthorityId] = useState("");
  const [authorityName, setAuthorityName] = useState("");
  const [officer, setOfficer] = useState("Central Public Information Officer");
  const [filter, setFilter] = useState("");
  const [matchedTerm, setMatchedTerm] = useState<string | null>(null);
  const [pickedManually, setPickedManually] = useState(false);
  const authorities = useMemo(() => listAuthorities(), []);

  useEffect(() => {
    if (!draft) return;
    const matched =
      draft.bodyLevel === "central"
        ? matchAuthorityWithReason(draft.subject)
        : { authority: authorities.find((item) => item.id === "unknown_central")!, matchedTerm: null };
    const match = matched.authority;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- browser-only storage and matchMedia can only be read after mount. This previously ran inside requestAnimationFrame, which never fires in a hidden tab and left the page blank.
    setAuthorityId(draft.authorityId ?? match.id);
    setMatchedTerm(matched.matchedTerm);
    setAuthorityName(
      draft.authorityName ??
        (match.id === "unknown_central" ? "" : match.name),
    );
    setOfficer(
      draft.officer ??
        (draft.bodyLevel === "state"
          ? "State Public Information Officer"
          : draft.bodyLevel === "unknown"
            ? "Public Information Officer"
            : match.officer),
    );
  }, [authorities, draft]);

  if (!ready) return null;
  if (!draft) return <Shell step="authority" eyebrow={rtiCopy.authority.eyebrow} heading={rtiCopy.authority.heading}><Link href="/file">{rtiCopy.common.back}</Link></Shell>;

  const selected = authorities.find((item) => item.id === authorityId);
  const unknown = authorityId === "unknown_central" || !authorityName.trim();
  const isCentral = draft.bodyLevel === "central";
  const needle = filter.trim().toLocaleLowerCase("en-IN");
  const filtered = authorities.filter((item) => {
    if (item.id === "unknown_central") return false;
    if (!needle) return true;
    // Match the name, the ministry or any authored search term, so typing
    // "provident fund" or "UAN" both find EPFO.
    return (
      item.name.toLocaleLowerCase("en-IN").includes(needle) ||
      item.ministry.toLocaleLowerCase("en-IN").includes(needle) ||
      item.matches.some((term) =>
        term.toLocaleLowerCase("en-IN").includes(needle),
      )
    );
  });
  const browsable = filtered.length > 0
    ? filtered
    : authorities.filter((item) => item.id !== "unknown_central");
  const authorityGroups = new Map<
    string,
    Array<(typeof browsable)[number]>
  >();
  for (const authority of browsable) {
    const group = authorityGroups.get(authority.ministry) ?? [];
    group.push(authority);
    authorityGroups.set(authority.ministry, group);
  }
  const groupedAuthorities = [...authorityGroups.entries()];

  function choose(id: string) {
    const picked = authorities.find((item) => item.id === id);
    if (!picked) return;
    setPickedManually(true);
    setAuthorityId(picked.id);
    setAuthorityName(picked.name);
    setOfficer(picked.officer);
  }

  function proceed() {
    const nextAuthority = authorityName.trim();
    const changed =
      draft!.authorityName !== nextAuthority || draft!.officer !== officer;
    update({
      ...draft!,
      authorityId,
      authorityName: nextAuthority,
      officer,
      rewritten: changed ? undefined : draft!.rewritten,
      changes: changed ? undefined : draft!.changes,
    });
    router.push("/file/draft");
  }

  return (
    <Shell step="authority" eyebrow={rtiCopy.authority.eyebrow} heading={rtiCopy.authority.heading}>
      {isCentral && !unknown && selected ? (
        <p className="rti-reasoning">
          {pickedManually || !matchedTerm
            ? rtiCopy.authority.reasoningManual(selected.name)
            : rtiCopy.authority.reasoning(matchedTerm, selected.name)}
        </p>
      ) : null}

      {isCentral ? (
        <section className="rti-authority-search">
          <label className="rti-field">
            <span>{rtiCopy.authority.searchLabel}</span>
            <input
              autoComplete="off"
              onChange={(event) => setFilter(event.target.value)}
              placeholder={rtiCopy.authority.searchPlaceholder}
              type="search"
              value={filter}
            />
            <small>{rtiCopy.authority.searchHint}</small>
          </label>

          {/* A visible list, not a datalist. A datalist renders nothing until
              the field is focused and gives no sign it exists at all. */}
          {filtered.length === 0 ? (
            <p className="rti-warning rti-warning--caution">{rtiCopy.authority.noMatch}</p>
          ) : null}
          <div className="rti-authority-groups">
            {groupedAuthorities.map(([ministry, entries]) => (
              <section key={ministry}>
                <h3>{ministry}</h3>
                <ul className="rti-authority-options">
                  {entries.map((authority) => (
                    <li key={authority.id}>
                      <button
                        aria-pressed={authorityId === authority.id}
                        className={authorityId === authority.id ? "is-selected" : undefined}
                        onClick={() => choose(authority.id)}
                        type="button"
                      >
                        <span className="rti-icon-tile rti-icon-tile--sm">
                          <Icon name={authorityIcon(authority.id)} />
                        </span>
                        <span>
                          <strong>{authority.name}</strong>
                          <small>{authority.ministry}</small>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </section>
      ) : null}

      {selected && selected.id !== "unknown_central" ? (
        <section className="rti-authority-detail">
          <div>
            <h3>{selected.ministry}</h3>
          </div>
          <div>
            <h4>{rtiCopy.authority.holdsHeading}</h4>
            <p>{selected.records}</p>
          </div>
          <div>
            <h4>{rtiCopy.authority.officerNoteHeading}</h4>
            <p>{selected.officerNote}</p>
          </div>
          {selected.matches.length ? (
            <div>
              <h4>{rtiCopy.authority.termsHeading}</h4>
              <ul className="rti-authority-terms">
                {selected.matches.map((term) => (
                  <li key={term}>{term}</li>
                ))}
              </ul>
            </div>
          ) : null}
          <div>
            <a href={selected.siteUrl} rel="noreferrer" target="_blank">
              {selected.siteLabel}
            </a>
          </div>
        </section>
      ) : null}

      {unknown ? (
        <p className="rti-warning rti-warning--caution">
          {isCentral ? rtiCopy.authority.unknown : rtiCopy.authority.stateUnknown}
        </p>
      ) : null}
      <label className="rti-field">
        <span>{rtiCopy.authority.name}</span>
        <input
          onChange={(event) => setAuthorityName(event.target.value)}
          value={authorityName}
        />
      </label>
      <label className="rti-field">
        <span>{rtiCopy.authority.officer}</span>
        <input onChange={(event) => setOfficer(event.target.value)} value={officer} />
      </label>
      <p className="rti-note">{rtiCopy.authority.directory}</p>
      <p className="rti-note">{rtiCopy.authority.transfer}</p>
      <button
        className="rti-primary"
        disabled={!authorityName.trim() || !officer.trim()}
        onClick={proceed}
        type="button"
      >
        {rtiCopy.common.continue}
      </button>
      {!authorityName.trim() || !officer.trim() ? (
        <p className="rti-disabled-reason">{rtiCopy.authority.disabledReason}</p>
      ) : null}
    </Shell>
  );
}

function DraftStep() {
  const router = useRouter();
  const { draft, ready, update } = useStoredDraft();
  const [rewritten, setRewritten] = useState("");
  const [changes, setChanges] = useState<RewriteChange[]>([]);
  const [pending, setPending] = useState(true);

  useEffect(() => {
    if (!draft) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- browser-only storage and matchMedia can only be read after mount. This previously ran inside requestAnimationFrame, which never fires in a hidden tab and left the page blank.
    setRewritten(draft.rewritten ?? draft.rawText);
    setChanges(draft.changes ?? []);
    if (draft.rewritten) setPending(false);
  }, [draft]);

  useEffect(() => {
    if (!draft || draft.rewritten) return;
    let cancelled = false;
    fetch("/api/reframe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: draft.rawText,
        authority: draft.authorityName,
      }),
    })
      .then((response) => response.json())
      .then((result: { rewritten?: string; changes?: RewriteChange[] }) => {
        if (cancelled) return;
        setRewritten(result.rewritten || draft.rawText);
        setChanges(result.changes ?? []);
      })
      .catch(() => {
        if (cancelled) return;
        setRewritten(draft.rawText);
        setChanges([
          {
            title: rtiCopy.draft.fallbackTitle,
            reason: rtiCopy.draft.fallbackReason,
          },
        ]);
      })
      .finally(() => {
        if (!cancelled) setPending(false);
      });
    return () => {
      cancelled = true;
    };
  }, [draft]);

  if (!ready) return null;
  if (!draft) return <Shell step="draft" eyebrow={rtiCopy.draft.eyebrow} heading={rtiCopy.draft.heading}><Link href="/file">{rtiCopy.common.back}</Link></Shell>;

  function proceed() {
    update({ ...draft!, rewritten, changes });
    router.push("/file/checks");
  }

  return (
    <Shell step="draft" eyebrow={rtiCopy.draft.eyebrow} heading={rtiCopy.draft.heading}>
      <div className="rti-rewrite-grid">
        <section>
          <h2>{rtiCopy.draft.original}</h2>
          <div className="rti-original-text">{draft.rawText}</div>
        </section>
        <section>
          <h2>{rtiCopy.draft.rewritten}</h2>
          <textarea
            aria-label={rtiCopy.draft.rewritten}
            id="filing-text"
            onChange={(event) => setRewritten(event.target.value)}
            rows={14}
            value={rewritten}
          />
          <p className={rewritten.length > 3_000 ? "rti-count is-over" : "rti-count"}>
            {rtiCopy.draft.count(rewritten.length)}
          </p>
        </section>
      </div>
      <section className="rti-changes">
        <h2>{rtiCopy.draft.changes}</h2>
        {pending ? <p>{rtiCopy.common.loading}</p> : (
          <ol>
            {changes.map((change, index) => (
              <li key={`${change.title}-${index}`}>
                <strong>{change.title}</strong>
                <p>{change.reason}</p>
              </li>
            ))}
          </ol>
        )}
      </section>
      <button
        className="rti-primary"
        disabled={pending || !rewritten.trim()}
        onClick={proceed}
        type="button"
      >
        {rtiCopy.draft.action}
      </button>
      {pending || !rewritten.trim() ? (
        <p className="rti-disabled-reason">{rtiCopy.draft.disabledReason}</p>
      ) : null}
    </Shell>
  );
}

function ChecksStep() {
  const router = useRouter();
  const { draft, ready, update } = useStoredDraft();
  const [singleSubject, setSingleSubject] = useState(true);
  const [asksForRecords, setAsksForRecords] = useState(true);
  const [hasIdentityDocuments, setHasIdentityDocuments] = useState(false);
  const [hasBplCertificate, setHasBplCertificate] = useState(false);
  const [attachment, setAttachment] = useState<PreflightInput["attachment"]>();
  const [downloaded, setDownloaded] = useState(false);
  const [trackingPending, setTrackingPending] = useState(false);
  const [trackingError, setTrackingError] = useState("");

  useEffect(() => {
    if (!draft) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- browser-only storage and matchMedia can only be read after mount. This previously ran inside requestAnimationFrame, which never fires in a hidden tab and left the page blank.
    setSingleSubject(draft.singleSubject ?? true);
    setAsksForRecords(
      draft.asksForRecords ?? draft.wantsAction !== "action",
    );
    setHasIdentityDocuments(draft.hasIdentityDocuments ?? false);
    setHasBplCertificate(draft.hasBplCertificate ?? false);
    setAttachment(draft.attachment);
  }, [draft]);

  if (!ready) return null;
  if (!draft?.bodyLevel) return <Shell step="checks" eyebrow={rtiCopy.checks.eyebrow} heading={rtiCopy.checks.heading}><Link href="/file">{rtiCopy.common.back}</Link></Shell>;

  const input: PreflightInput = {
    bodyLevel: draft.bodyLevel,
    text: draft.rewritten || draft.rawText,
    singleSubject,
    asksForRecords,
    hasIdentityDocuments,
    attachment,
    isBPL: draft.isBPL ?? "no",
    hasBplCertificate,
  };
  const results = evaluatePreflightChecks(input);
  const blocked = results.some((result) => result.status === "block");
  const manualBlocked = results.some(
    (result) => result.status === "block" && result.id !== "jurisdiction",
  );

  async function download() {
    const current = draft!;
    const authority = listAuthorities().find(
      (item) => item.id === current.authorityId,
    );
    // pdf-lib is only needed when the citizen actually asks for the file, so it
    // is loaded on demand rather than shipped in the page bundle.
    const { buildApplicationPdf } = await import("@/lib/rti/application-pdf");
    const bytes = await buildApplicationPdf({
      authorityName: current.authorityName || rtiCopy.checks.unknownAuthority,
      officer: current.officer || "Public Information Officer",
      ministry:
        authority && authority.name === current.authorityName
          ? authority.ministry || undefined
          : undefined,
      body: current.rewritten || current.rawText,
      registrationNumber:
        current.registrationNumber ||
        (current.bodyLevel === "central" ? rtiCopy.submit.registration : undefined),
      date: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      simulated: true,
    });
    const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "rti-application.pdf";
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
    setDownloaded(true);
  }

  async function startStateTracker() {
    setTrackingPending(true);
    setTrackingError("");
    try {
      const response = await fetch("/api/case", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          extracted: {
            ...draft,
            singleSubject,
            asksForRecords,
            hasIdentityDocuments,
            attachment,
            hasBplCertificate,
          },
          manualFiling: true,
        }),
      });
      const result = (await response.json()) as { code?: string };
      if (!response.ok || !result.code) throw new Error("case");
      router.push(`/case/${result.code}`);
    } catch {
      setTrackingError(rtiCopy.common.error);
      setTrackingPending(false);
    }
  }

  function proceed() {
    update({
      ...draft!,
      singleSubject,
      asksForRecords,
      hasIdentityDocuments,
      attachment,
      hasBplCertificate,
    });
    router.push("/file/submit");
  }

  return (
    <Shell step="checks" eyebrow={rtiCopy.checks.eyebrow} heading={rtiCopy.checks.heading}>
      <div className="rti-check-controls">
        <label><input checked={singleSubject} onChange={(event) => setSingleSubject(event.target.checked)} type="checkbox" /> {rtiCopy.checks.singleSubject}</label>
        <label><input checked={asksForRecords} onChange={(event) => setAsksForRecords(event.target.checked)} type="checkbox" /> {rtiCopy.checks.asksForRecords}</label>
        <label id="identity-documents"><input checked={hasIdentityDocuments} onChange={(event) => setHasIdentityDocuments(event.target.checked)} type="checkbox" /> {rtiCopy.checks.identity}</label>
        {draft.isBPL === "yes" ? <label id="bpl-certificate"><input checked={hasBplCertificate} onChange={(event) => setHasBplCertificate(event.target.checked)} type="checkbox" /> {rtiCopy.checks.bpl}</label> : null}
        <label className="rti-field" id="attachment">
          <span>{rtiCopy.checks.attachment}</span>
          <input
            accept="application/pdf"
            onChange={(event) => {
              const file = event.target.files?.[0];
              setAttachment(file ? { name: file.name, type: file.type, size: file.size } : undefined);
            }}
            type="file"
          />
        </label>
      </div>
      <div className="rti-check-list">
        {results.map((result) => result.status === "pass" ? (
          <article className="rti-check rti-check--pass rti-check--collapsed" key={result.id}>
            <span aria-hidden="true" className="rti-check__pass-mark">✓</span>
            <h2>{result.label}</h2>
            <strong>{rtiCopy.checks.pass}</strong>
          </article>
        ) : (
          <article className={`rti-check rti-check--${result.status}`} key={result.id}>
              <span className="rti-icon-tile rti-icon-tile--sm"><Icon name={checkIcon(result.id)} /></span>
            <header>
              <h2>{result.label}</h2>
              <span>{result.status === "warn" ? rtiCopy.checks.warn : rtiCopy.checks.block}</span>
            </header>
            <p><strong>{rtiCopy.checks.consequence}:</strong> {result.fail}</p>
            <p><strong>{rtiCopy.checks.fix}:</strong> {result.fix}</p>
            <Link className="rti-secondary rti-fix-link" href={checkFixHrefs[result.id] ?? "/file"}>{rtiCopy.checks.fixAction}</Link>
          </article>
        ))}
      </div>
      {draft.draftOnly ? (
        <>
          <div className="rti-actions">
            <button className={downloaded ? "rti-secondary" : "rti-primary"} onClick={download} type="button">{rtiCopy.checks.download}</button>
            {draft.bodyLevel === "unknown" ? <Link href="/file/jurisdiction">{rtiCopy.checks.resolve}</Link> : null}
          </div>
          {downloaded && draft.bodyLevel === "state" ? (
            <section className="rti-post-download" role="status">
              <h2>{rtiCopy.checks.downloadReady}</h2>
              <p>{rtiCopy.checks.stateNext}</p>
              <button className="rti-primary" disabled={manualBlocked || trackingPending} onClick={startStateTracker} type="button">
                {trackingPending ? rtiCopy.checks.tracking : rtiCopy.checks.stateTrack}
              </button>
              <small>{rtiCopy.checks.stateTrackNote}</small>
              {trackingError ? <p className="rti-error">{trackingError}</p> : null}
            </section>
          ) : null}
        </>
      ) : (
        <div className="rti-actions">
          <button className="rti-secondary" onClick={download} type="button">{rtiCopy.checks.download}</button>
          <button className="rti-primary" disabled={blocked} onClick={proceed} type="button">{rtiCopy.checks.submit}</button>
          {blocked ? <small>{rtiCopy.checks.blocked}</small> : null}
        </div>
      )}
    </Shell>
  );
}

function SubmitStep() {
  const router = useRouter();
  const { draft, ready } = useStoredDraft();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [aadhaarState, setAadhaarState] = useState<"none" | "ok" | "refused">("none");
  const [otpShown, setOtpShown] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState(false);
  const [pending, setPending] = useState(false);

  if (!ready) return null;
  if (!draft || draft.bodyLevel !== "central" || draft.draftOnly) {
    return <Shell step="submit" eyebrow={rtiCopy.submit.eyebrow} heading={rtiCopy.submit.heading}><Link href="/file/jurisdiction">{rtiCopy.common.back}</Link></Shell>;
  }

  async function createCase() {
    setPending(true);
    try {
      const response = await fetch("/api/case", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          extracted: {
            ...draft,
            registrationNumber: rtiCopy.submit.registration,
          },
        }),
      });
      const result = (await response.json()) as { code?: string };
      if (!response.ok || !result.code) throw new Error("case");
      router.push(`/case/${result.code}`);
    } finally {
      setPending(false);
    }
  }

  return (
    <Shell step="submit" eyebrow={rtiCopy.submit.eyebrow} heading={rtiCopy.submit.heading}>
      <p className="rti-simulation-label">{rtiCopy.submit.label}</p>
      <div className="rti-submit-grid">
        <section className={step === 1 ? "rti-submit-step is-active" : "rti-submit-step"}>
        <h2>{rtiCopy.submit.emailStep}</h2>
        <label className="rti-field">
          <span>{rtiCopy.submit.email}</span>
          <input onChange={(event) => setEmail(event.target.value)} placeholder={rtiCopy.submit.emailPlaceholder} type="email" value={email} />
        </label>
        {!otpShown ? <button className="rti-secondary" disabled={!email.trim()} onClick={() => setOtpShown(true)} type="button">{rtiCopy.submit.sendOtp}</button> : (
          <>
            <div className="rti-otp-panel">{rtiCopy.submit.otpPanel}</div>
            <label className="rti-field"><span>{rtiCopy.submit.otp}</span><input inputMode="numeric" maxLength={4} onChange={(event) => setOtp(event.target.value)} value={otp} /></label>
            {otpError ? <p className="rti-error">{rtiCopy.submit.wrongOtp}</p> : null}
            <button className="rti-primary" onClick={() => { if (otp === "4471") { setOtpError(false); setStep(2); } else setOtpError(true); }} type="button">{rtiCopy.submit.verify}</button>
          </>
        )}
        </section>
        <section className={step === 2 ? "rti-submit-step is-active" : "rti-submit-step"}>
        <h2>{rtiCopy.submit.identityStep}</h2>
        {step >= 2 ? (
          <>
            <p className="rti-simulation-label">{rtiCopy.submit.identityLabel}</p>
            <label className="rti-field">
              <span>{rtiCopy.submit.mobile}</span>
              <input
                inputMode="numeric"
                maxLength={10}
                onChange={(event) => setMobile(digitsOnly(event.target.value))}
                placeholder={rtiCopy.submit.mobilePlaceholder}
                value={mobile}
              />
              <small>{rtiCopy.submit.mobileNote}</small>
            </label>
            <button className="rti-secondary" onClick={() => setMobile("9000000000")} type="button">
              {rtiCopy.submit.useSynthetic}
            </button>
            <div className="rti-warning rti-warning--critical">{rtiCopy.submit.aadhaarWarning}</div>
            <label className="rti-field">
              <span>{rtiCopy.submit.aadhaar}</span>
              <input
                inputMode="numeric"
                maxLength={14}
                onChange={(event) => {
                  const digits = digitsOnly(event.target.value);
                  // A number that satisfies the checksum could be a real
                  // Aadhaar, so it is refused and never stored.
                  if (digits.length === 12 && passesVerhoeff(digits)) {
                    setAadhaar("");
                    setAadhaarState("refused");
                    return;
                  }
                  setAadhaar(digits);
                  setAadhaarState(digits.length === 12 ? "ok" : "none");
                }}
                value={aadhaar}
              />
              <small>{rtiCopy.submit.aadhaarNote}</small>
            </label>
            <button
              className="rti-secondary"
              onClick={() => { setAadhaar(synthesiseInvalidAadhaar(7)); setAadhaarState("ok"); }}
              type="button"
            >
              {rtiCopy.submit.useSynthetic}
            </button>
            {aadhaarState === "refused" ? <p className="rti-error" role="alert">{rtiCopy.submit.aadhaarRejected}</p> : null}
            {aadhaarState === "ok" ? <p role="status">{rtiCopy.submit.aadhaarAccepted}</p> : null}
            <button
              className="rti-primary"
              disabled={mobile.length !== 10}
              onClick={() => setStep(3)}
              type="button"
            >
              {rtiCopy.submit.identityContinue}
            </button>
            {mobile.length !== 10 ? <p className={mobile.length > 0 ? "rti-error" : "rti-disabled-reason"}>{mobile.length > 0 ? rtiCopy.submit.mobileInvalid : rtiCopy.submit.mobileRequired}</p> : null}
          </>
        ) : null}
        </section>
        <section className={step === 3 ? "rti-submit-step is-active" : "rti-submit-step"}>
        <h2>{rtiCopy.submit.feeStep}</h2>
        {step >= 3 ? (
          <>
            <p>{draft.isBPL === "yes" ? rtiCopy.submit.feeBpl : rtiCopy.submit.feePaid}</p>
            <p className="rti-note">{rtiCopy.submit.paymentNote}</p>
            <button className="rti-primary" onClick={() => setStep(4)} type="button">{rtiCopy.submit.pay}</button>
          </>
        ) : null}
        </section>
        <section className={step === 4 ? "rti-submit-step is-active" : "rti-submit-step"}>
        <h2>{rtiCopy.submit.registrationStep}</h2>
        {step === 4 ? (
          <>
            <p className="rti-registration-label">{rtiCopy.submit.registrationLabel}</p>
            <strong className="rti-registration">{rtiCopy.submit.registration}</strong>
            <div className="rti-warning rti-warning--critical">{rtiCopy.submit.warning}</div>
            <button className="rti-primary" disabled={pending} onClick={createCase} type="button">{pending ? rtiCopy.common.loading : rtiCopy.submit.create}</button>
          </>
        ) : null}
        </section>
      </div>
    </Shell>
  );
}

export function FileJourney({ step }: { step: Step }) {
  switch (step) {
    case "describe":
      return <DescribeStep />;
    case "jurisdiction":
      return <JurisdictionStep />;
    case "authority":
      return <AuthorityStep />;
    case "draft":
      return <DraftStep />;
    case "checks":
      return <ChecksStep />;
    case "submit":
      return <SubmitStep />;
  }
}
