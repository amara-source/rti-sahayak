"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { rtiCopy } from "@/content/rti-copy";
import { PageHero, type HeroTone } from "@/components/rti/PageHero";
import { FilledIcon } from "@/components/rti/FilledIcon";
import { listAuthorities, matchAuthority } from "@/lib/engine/authority";
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
    const frame = window.requestAnimationFrame(() => {
      setDraftState(loadDraft());
      setReady(true);
    });
    return () => window.cancelAnimationFrame(frame);
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
  children,
}: {
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
        <FilledIcon seed={`file-step:${eyebrow}:${heading}`} />
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
    useState<"records" | "status" | "action">("records");
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
    <Shell eyebrow={rtiCopy.describe.eyebrow} heading={rtiCopy.describe.heading}>
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
      <div className="rti-template-chips">
        {rtiCopy.describe.templates.map((template) => (
          <button key={template} onClick={() => setText(template)} type="button">
            {template}
          </button>
        ))}
      </div>
      <button
        className="rti-primary"
        disabled={!text.trim() || pending}
        onClick={extract}
        type="button"
      >
        {pending ? rtiCopy.common.loading : rtiCopy.describe.submitAction}
      </button>

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

  useEffect(() => {
    if (!draft) return;
    const frame = window.requestAnimationFrame(() => {
      setBodyLevel(draft.bodyLevel ?? "unknown");
      setState(draft.state ?? "");
    });
    return () => window.cancelAnimationFrame(frame);
  }, [draft]);

  if (!ready) return null;
  if (!draft) return <Shell eyebrow={rtiCopy.jurisdiction.eyebrow} heading={rtiCopy.jurisdiction.heading}><Link href="/file">{rtiCopy.common.back}</Link></Shell>;

  const warning = computeJourney("rti", { bodyLevel }).find(
    (node) => node.id === "jurisdiction_check",
  )?.warnings[0];
  const needsState = bodyLevel !== "central";

  function proceed(draftOnly: boolean) {
    update({ ...draft!, bodyLevel, state, draftOnly });
    router.push("/file/authority");
  }

  return (
    <Shell eyebrow={rtiCopy.jurisdiction.eyebrow} heading={rtiCopy.jurisdiction.heading}>
      <fieldset className="rti-choice-group">
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
        <label className="rti-field">
          <span>{rtiCopy.jurisdiction.stateLabel}</span>
          <input onChange={(event) => setState(event.target.value)} value={state} />
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
  const authorities = useMemo(() => listAuthorities(), []);

  useEffect(() => {
    if (!draft) return;
    const match =
      draft.bodyLevel === "central"
        ? matchAuthority(draft.subject)
        : authorities.find((item) => item.id === "unknown_central")!;
    const frame = window.requestAnimationFrame(() => {
      setAuthorityId(draft.authorityId ?? match.id);
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
    });
    return () => window.cancelAnimationFrame(frame);
  }, [authorities, draft]);

  if (!ready) return null;
  if (!draft) return <Shell eyebrow={rtiCopy.authority.eyebrow} heading={rtiCopy.authority.heading}><Link href="/file">{rtiCopy.common.back}</Link></Shell>;

  const unknown = authorityId === "unknown_central" || !authorityName.trim();

  function choose(id: string) {
    const selected = authorities.find((item) => item.id === id);
    if (!selected) return;
    setAuthorityId(id);
    setAuthorityName(selected.id === "unknown_central" ? "" : selected.name);
    setOfficer(selected.officer);
  }

  function proceed() {
    update({ ...draft!, authorityId, authorityName: authorityName.trim(), officer });
    router.push("/file/draft");
  }

  return (
    <Shell eyebrow={rtiCopy.authority.eyebrow} heading={rtiCopy.authority.heading}>
      {draft.bodyLevel === "central" && !unknown ? (
        <p className="rti-reasoning">
          {rtiCopy.authority.reasoning(draft.subject, authorityName)}
        </p>
      ) : null}
      {draft.bodyLevel === "central" ? (
        <label className="rti-field">
          <span>{rtiCopy.authority.name}</span>
          <select onChange={(event) => choose(event.target.value)} value={authorityId}>
            {authorities.map((authority) => (
              <option key={authority.id} value={authority.id}>{authority.name}</option>
            ))}
          </select>
        </label>
      ) : null}
      {unknown ? <p className="rti-warning rti-warning--caution">{rtiCopy.authority.unknown}</p> : null}
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
    const frame = window.requestAnimationFrame(() => {
      setRewritten(draft.rewritten ?? draft.rawText);
      setChanges(draft.changes ?? []);
      if (draft.rewritten) setPending(false);
    });
    return () => window.cancelAnimationFrame(frame);
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
  if (!draft) return <Shell eyebrow={rtiCopy.draft.eyebrow} heading={rtiCopy.draft.heading}><Link href="/file">{rtiCopy.common.back}</Link></Shell>;

  function proceed() {
    update({ ...draft!, rewritten, changes });
    router.push("/file/checks");
  }

  return (
    <Shell eyebrow={rtiCopy.draft.eyebrow} heading={rtiCopy.draft.heading}>
      <div className="rti-rewrite-grid">
        <section>
          <h2>{rtiCopy.draft.original}</h2>
          <div className="rti-original-text">{draft.rawText}</div>
        </section>
        <section>
          <h2>{rtiCopy.draft.rewritten}</h2>
          <textarea
            aria-label={rtiCopy.draft.rewritten}
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

  useEffect(() => {
    if (!draft) return;
    const frame = window.requestAnimationFrame(() => {
      setSingleSubject(draft.singleSubject ?? true);
      setAsksForRecords(
        draft.asksForRecords ?? draft.wantsAction !== "action",
      );
      setHasIdentityDocuments(draft.hasIdentityDocuments ?? false);
      setHasBplCertificate(draft.hasBplCertificate ?? false);
      setAttachment(draft.attachment);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [draft]);

  if (!ready) return null;
  if (!draft?.bodyLevel) return <Shell eyebrow={rtiCopy.checks.eyebrow} heading={rtiCopy.checks.heading}><Link href="/file">{rtiCopy.common.back}</Link></Shell>;

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

  function download() {
    const text = [
      `To: ${draft!.authorityName}`,
      `Officer: ${draft!.officer}`,
      "",
      draft!.rewritten || draft!.rawText,
    ].join("\n");
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "rti-application.txt";
    anchor.click();
    URL.revokeObjectURL(url);
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
    <Shell eyebrow={rtiCopy.checks.eyebrow} heading={rtiCopy.checks.heading}>
      <div className="rti-check-controls">
        <label><input checked={singleSubject} onChange={(event) => setSingleSubject(event.target.checked)} type="checkbox" /> {rtiCopy.checks.singleSubject}</label>
        <label><input checked={asksForRecords} onChange={(event) => setAsksForRecords(event.target.checked)} type="checkbox" /> {rtiCopy.checks.asksForRecords}</label>
        <label><input checked={hasIdentityDocuments} onChange={(event) => setHasIdentityDocuments(event.target.checked)} type="checkbox" /> {rtiCopy.checks.identity}</label>
        {draft.isBPL === "yes" ? <label><input checked={hasBplCertificate} onChange={(event) => setHasBplCertificate(event.target.checked)} type="checkbox" /> {rtiCopy.checks.bpl}</label> : null}
        <label className="rti-field">
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
        {results.map((result) => (
          <article className={`rti-check rti-check--${result.status}`} key={result.id}>
            <header>
              <h2>{result.label}</h2>
              <span>{result.status === "pass" ? rtiCopy.checks.pass : result.status === "warn" ? rtiCopy.checks.warn : rtiCopy.checks.block}</span>
            </header>
            {result.status !== "pass" ? (
              <>
                <p><strong>{rtiCopy.checks.consequence}:</strong> {result.fail}</p>
                <p><strong>{rtiCopy.checks.fix}:</strong> {result.fix}</p>
              </>
            ) : null}
          </article>
        ))}
      </div>
      {draft.draftOnly ? (
        <div className="rti-actions">
          <button className="rti-primary" onClick={download} type="button">{rtiCopy.checks.download}</button>
          {draft.bodyLevel === "unknown" ? <Link href="/file/jurisdiction">{rtiCopy.checks.resolve}</Link> : null}
        </div>
      ) : (
        <div className="rti-actions">
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
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [otpShown, setOtpShown] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState(false);
  const [pending, setPending] = useState(false);

  if (!ready) return null;
  if (!draft || draft.bodyLevel !== "central" || draft.draftOnly) {
    return <Shell eyebrow={rtiCopy.submit.eyebrow} heading={rtiCopy.submit.heading}><Link href="/file/jurisdiction">{rtiCopy.common.back}</Link></Shell>;
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
    <Shell eyebrow={rtiCopy.submit.eyebrow} heading={rtiCopy.submit.heading}>
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
        <h2>{rtiCopy.submit.feeStep}</h2>
        {step >= 2 ? (
          <>
            <p>{draft.isBPL === "yes" ? rtiCopy.submit.feeBpl : rtiCopy.submit.feePaid}</p>
            <p className="rti-note">{rtiCopy.submit.paymentNote}</p>
            <button className="rti-primary" onClick={() => setStep(3)} type="button">{rtiCopy.submit.pay}</button>
          </>
        ) : null}
        </section>
        <section className={step === 3 ? "rti-submit-step is-active" : "rti-submit-step"}>
        <h2>{rtiCopy.submit.registrationStep}</h2>
        {step === 3 ? (
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
