"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { rtiCopy as englishCopy } from "@/content/rti-copy";
import { useCopy } from "@/lib/i18n/LanguageProvider";
import { nodeSummary, nodeTitle } from "@/lib/rti/node-text";
import type { Plan, RenderedNode, Status } from "@/lib/engine/types";
import { PageHero } from "./PageHero";
import { EmptyStep } from "./EmptyStep";
import { Icon } from "./Icon";
import { nodeIcon } from "@/lib/rti/icon-map";

type AppealKind = "first" | "second" | "complaint";

interface CaseResponse {
  case: Plan;
  nodes: RenderedNode[];
}

const nodeIds: Record<AppealKind, string> = {
  first: "first_appeal",
  second: "second_appeal",
  complaint: "section_18_complaint",
};

function initialDraft(kind: AppealKind, registration: string): string {
  if (kind === "first") {
    return `To: The First Appellate Authority\n\nSubject: First Appeal under the Right to Information Act\n\nOriginal RTI registration: ${registration}\n\nNo reply was received within the statutory reply period. I ask that this appeal be decided and the records requested in the original application be provided.`;
  }
  if (kind === "second") {
    return `To: The Information Commission\n\nSubject: Second Appeal under the Right to Information Act\n\nOriginal RTI registration: ${registration}\n\nI completed the First Appeal route. I ask the Commission to consider this Second Appeal and the record of the original request and First Appeal.`;
  }
  return `To: The Information Commission\n\nSubject: Complaint under Section 18 of the Right to Information Act\n\nOriginal RTI registration: ${registration}\n\nI ask the Commission to examine the Public Information Officer's conduct in relation to this request.`;
}

export function AppealJourney({ kind }: { kind: AppealKind }) {
  // Interface copy in the selected language, English where untranslated.
  const { rti: rtiCopy, language } = useCopy();
  const [data, setData] = useState<CaseResponse | null>(null);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const copy = rtiCopy.appeals[kind];
  const nodeId = nodeIds[kind];

  useEffect(() => {
    let cancelled = false;
    fetch("/api/case")
      .then((response) => {
        if (!response.ok) throw new Error("case");
        return response.json();
      })
      .then((result: CaseResponse) => {
        if (cancelled) return;
        setData(result);
        setDraft(initialDraft(kind, String(result.case.answers.registrationNumber ?? "Not recorded")));
      })
      .catch(() => {
        if (!cancelled) setError(rtiCopy.api.notFound);
      });
    return () => { cancelled = true; };
  }, [kind]);

  const node = data?.nodes.find((item) => item.id === nodeId);
  const dependency = useMemo(() => {
    if (!data || !node) return "";
    return node.dependsOn
      .map((id) => {
        const found = data.nodes.find((item) => item.id === id);
        return found ? nodeTitle(found, language) : undefined;
      })
      .filter(Boolean)
      .join(", ");
  }, [data, node]);

  async function setStatus(status: Status) {
    if (!data) return;
    setPending(true);
    setError("");
    try {
      const response = await fetch(`/api/case/${data.case.code}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nodeId, status }),
      });
      if (!response.ok) throw new Error("status");
      setData(await response.json() as CaseResponse);
    } catch {
      setError(rtiCopy.appeals.submitError);
    } finally {
      setPending(false);
    }
  }

  async function advanceDecision() {
    if (!data) return;
    setPending(true);
    try {
      const response = await fetch(`/api/case/${data.case.code}/advance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Two steps rather than one jump: part way through the window, then
        // past it. Each click has to show a different state.
        body: JSON.stringify({ days: decisionElapsed < 30 ? 30 : 16 }),
      });
      if (!response.ok) throw new Error("advance");
      setData(await response.json() as CaseResponse);
    } catch {
      setError(rtiCopy.appeals.advanceError);
    } finally {
      setPending(false);
    }
  }

  // No case in this browser. Explain the step rather than showing a bare error.
  if (error && !data) {
    return (
      <article className="rti-detail-page">
        <PageHero eyebrow={copy.eyebrow} illustration="/illustrations/tracker.png" supporting={copy.intro} title={copy.heading} tone={kind === "complaint" ? "orange" : "violet"} />
        <div className="rti-detail-content rti-overlap-card">
          <EmptyStep body={rtiCopy.empty.appealBody} icon={nodeIcon(nodeId)} what={copy.intro} />
        </div>
      </article>
    );
  }
  if (!data || !node) return <p className="rti-loading">{rtiCopy.common.loading}</p>;

  const status = data.case.statuses[nodeId] ?? "none";
  const registration = String(data.case.answers.registrationNumber ?? "Not recorded");
  const startedAt = data.case.startedAtHours?.[nodeId];
  const decisionElapsed = startedAt === undefined ? 0 : Math.max(0, Math.floor(((data.case.elapsedHours ?? 0) - startedAt) / 24));
  const decisionRemaining = Math.max(0, 45 - decisionElapsed);

  return (
    <article className="rti-detail-page rti-appeal-page">
      <PageHero eyebrow={copy.eyebrow} illustration="/illustrations/tracker.png" supporting={copy.intro} title={copy.heading} tone={kind === "complaint" ? "orange" : "violet"} />
      <div className="rti-detail-content rti-overlap-card rti-appeal-content">
        <Link className="rti-back-link" href={`/case/${data.case.code}`}>{rtiCopy.appeals.back}</Link>
        {node.locked ? (
          <section className="rti-appeal-lock" role="status">
            <span className="rti-icon-tile"><Icon name={nodeIcon(nodeId)} /></span>
            <div><h2>{rtiCopy.appeals.locked}</h2><p>{rtiCopy.appeals.lockedUntil} <strong>{dependency}</strong></p></div>
          </section>
        ) : (
          <>
            <div className="rti-appeal-facts">
              <section>
                <span className="rti-icon-tile"><Icon name="book" /></span>
                <h2>{rtiCopy.appeals.statutoryFacts}</h2>
                {/* The opening of the provision is what matters now. The rest
                    of the same rule pack text sits behind the disclosure, so
                    nothing is lost and nothing is a wall of ten lines. */}
                <p>{node.lead ?? node.body}</p>
                {node.lead && node.lead !== node.body ? (
                  <details className="rti-provision">
                    <summary>{rtiCopy.appeals.fullProvision}</summary>
                    <p>{node.body}</p>
                  </details>
                ) : null}
              </section>
              <section><span className="rti-icon-tile"><Icon name="receipt" /></span><h2>{rtiCopy.appeals.originalRegistration}</h2><strong>{registration}</strong></section>
              {kind === "complaint" ? <section className="rti-appeal-no-limit"><span className="rti-icon-tile"><Icon name="megaphone" /></span><h2>{rtiCopy.appeals.complaint.noLimit}</h2><p>{nodeSummary(node, language)}</p></section> : null}
            </div>
            {data.case.answers.bodyLevel === "state" && kind !== "complaint" ? (
              <p className="rti-warning rti-warning--info">
                {kind === "second"
                  ? rtiCopy.appeals.stateCommission
                  : rtiCopy.appeals.stateFirstAppeal}
              </p>
            ) : null}
            {node.warnings.map((warning) => <div className={`rti-warning rti-warning--${warning.severity}`} key={warning.text}>{warning.text}</div>)}
            {kind !== "complaint" ? (
              <section className="rti-appeal-draft">
                <h2>{kind === "first" ? rtiCopy.appeals.first.draftHeading : rtiCopy.appeals.second.draftHeading}</h2>
                <label className="rti-field"><span>{rtiCopy.appeals.draftLabel}</span><textarea onChange={(event) => setDraft(event.target.value)} rows={12} value={draft} /></label>
              </section>
            ) : null}
            {kind === "first" && status !== "none" ? (
              <section className="rti-appeal-clock">
                <div><strong>{decisionElapsed}</strong><span>{rtiCopy.appeals.daysElapsed}</span></div>
                <div><strong>{decisionRemaining}</strong><span>{rtiCopy.appeals.daysRemaining}</span></div>
                <p>{status === "done" ? rtiCopy.appeals.decidedBody : rtiCopy.appeals.first.clockReason}</p>
              </section>
            ) : null}
            <div className="rti-appeal-actions">
              {status === "none" || status === "stuck" ? <button className="rti-primary" disabled={pending} onClick={() => setStatus("applied")} type="button">{kind === "first" ? rtiCopy.appeals.first.submit : kind === "second" ? rtiCopy.appeals.second.submit : rtiCopy.appeals.complaint.submit}</button> : null}
              {kind === "first" && status === "applied" && decisionElapsed <= 45 ? <button className="rti-secondary" disabled={pending} onClick={advanceDecision} type="button">{rtiCopy.tracker.next}</button> : null}
              {kind === "first" && status === "applied" && decisionElapsed > 45 ? <button className="rti-primary" disabled={pending} onClick={() => setStatus("done")} type="button">{rtiCopy.appeals.first.complete}</button> : null}
              {status === "applied" && kind !== "first" ? <button className="rti-secondary" disabled={pending} onClick={() => setStatus("done")} type="button">{rtiCopy.detail.save}</button> : null}
              {/* Once the appeal is decided every earlier branch is false, which
                  previously left this block empty and stranded the citizen. */}
              {status === "done" ? (
                <>
                  {kind === "first" ? (
                    <Link className="rti-primary" href="/appeal/second">{rtiCopy.appeals.openSecond}</Link>
                  ) : null}
                  <Link className="rti-secondary" href={`/case/${data.case.code}`}>{rtiCopy.appeals.backToCase}</Link>
                </>
              ) : null}
              {status !== "none" ? <p role="status">{kind === "first" ? rtiCopy.appeals.first.submitted : kind === "second" ? rtiCopy.appeals.second.submitted : rtiCopy.appeals.complaint.submitted}</p> : null}
              <small>{rtiCopy.appeals.simulation}</small>
            </div>
          </>
        )}
        {error ? <p className="rti-error" role="alert">{error}</p> : null}
      </div>
    </article>
  );
}
