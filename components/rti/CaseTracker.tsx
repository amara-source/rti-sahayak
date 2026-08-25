"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { rtiCopy } from "@/content/rti-copy";
import { trackerCopy } from "@/content/tracker-copy";
import type { Plan, RenderedNode, Status } from "@/lib/engine/types";
import { TrackerPanel } from "@/components/tracker/TrackerPanel";
import { PageHero } from "@/components/rti/PageHero";
import { ProcessFlowchart } from "@/components/rti/ProcessFlowchart";
import { FilledIcon } from "@/components/rti/FilledIcon";

interface CaseResponse {
  case: Plan;
  nodes: RenderedNode[];
  fired?: string[];
}

function JobTag({ job }: { job: RenderedNode["job"] }) {
  return <span className={`rti-job rti-job--${job.toLowerCase()}`}>{rtiCopy.tracker.jobs[job]}</span>;
}

function Clock({
  plan,
  nodes,
  lapsed,
}: {
  plan: Plan;
  nodes: RenderedNode[];
  lapsed: boolean;
}) {
  const reply = nodes.find((node) => node.id === "await_reply");
  const lifeLiberty = plan.answers.lifeLiberty === "yes";
  const elapsed = plan.elapsedHours ?? 0;
  const limit = lifeLiberty ? 48 : 30 * 24;
  const elapsedValue = lifeLiberty ? elapsed : Math.floor(elapsed / 24);
  const remainingValue = lifeLiberty
    ? Math.max(0, limit - elapsed)
    : Math.max(0, 30 - Math.floor(elapsed / 24));
  const overdueValue = lifeLiberty
    ? Math.max(0, elapsed - limit)
    : Math.max(0, Math.floor((elapsed - limit) / 24));
  const consequence = reply?.clock?.consequence;
  const secondValue = lapsed ? overdueValue : remainingValue;

  return (
    <section className={lapsed ? "rti-clock is-lapsed" : "rti-clock"}>
      <div>
        <span>{rtiCopy.tracker.elapsed}</span>
        <strong>{elapsedValue}</strong>
        <small>{rtiCopy.tracker.unit(elapsedValue, lifeLiberty)}</small>
      </div>
      <div>
        <span>{lapsed ? rtiCopy.tracker.overdue : rtiCopy.tracker.remaining}</span>
        <strong>{secondValue}</strong>
        <small>{rtiCopy.tracker.unit(secondValue, lifeLiberty)}</small>
      </div>
      <div className="rti-clock__reason">
        <strong>{lapsed ? rtiCopy.tracker.lapsedClockLabel : reply?.clock?.label}</strong>
        <p>
          {lapsed && consequence
            ? rtiCopy.tracker.lapsedConsequence(consequence)
            : lifeLiberty
              ? rtiCopy.tracker.libertyReason
              : rtiCopy.tracker.ordinaryReason}
        </p>
      </div>
    </section>
  );
}

function CaseFacts({ code, plan }: { code: string; plan: Plan }) {
  const answers = plan.answers;
  const text = (key: string) => {
    const value = answers[key];
    return typeof value === "string" && value.trim() ? value.trim() : null;
  };
  const registration = text("registrationNumber");
  const authority = text("authorityName");
  const officer = text("officer");
  const rewritten = text("rewritten");
  const subject = text("subject");
  const copy = rtiCopy.tracker.facts;

  return (
    <>
      <div className="rti-case-facts">
        <div>
          <span>{rtiCopy.tracker.planCode}</span>
          <strong>{code}</strong>
        </div>
        {registration ? (
          <div>
            <span>{copy.registration}</span>
            <strong className="rti-case-facts__registration">{registration}</strong>
          </div>
        ) : null}
        {authority ? (
          <div>
            <span>{copy.authority}</span>
            <strong>{authority}</strong>
          </div>
        ) : null}
        {officer ? (
          <div>
            <span>{copy.officer}</span>
            <strong>{officer}</strong>
          </div>
        ) : null}
      </div>
      {rewritten ? (
        <section className="rti-case-request">
          <h2>{copy.requestHeading}</h2>
          <blockquote>{rewritten}</blockquote>
          <p>{copy.requestNote}</p>
          {subject ? (
            <details>
              <summary>{copy.original}</summary>
              <p>{subject}</p>
            </details>
          ) : null}
        </section>
      ) : null}
    </>
  );
}

export function CaseTracker({ code }: { code: string }) {
  const [data, setData] = useState<CaseResponse | null>(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState("");
  const [syncPending, setSyncPending] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [syncSummary, setSyncSummary] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/case/${code}`)
      .then((response) => {
        if (!response.ok) throw new Error("case");
        return response.json();
      })
      .then((result: CaseResponse) => {
        if (!cancelled) setData(result);
      })
      .catch(() => {
        if (!cancelled) setError(rtiCopy.api.notFound);
      });
    return () => {
      cancelled = true;
    };
  }, [code]);

  const groups = useMemo(() => {
    if (!data) return [];
    return (["before", "now", "next", "later"] as const)
      .map((bucket) => ({
        bucket,
        nodes: data.nodes.filter((node) => node.bucket === bucket),
      }))
      .filter((group) => group.nodes.length > 0);
  }, [data]);

  async function advance() {
    if (!data) return;
    setPending(true);
    setNotice("");
    const elapsed = data.case.elapsedHours ?? 0;
    const lifeLiberty = data.case.answers.lifeLiberty === "yes";
    const firstJump = lifeLiberty ? 2 : 31;
    const days = elapsed === 0 ? firstJump : 30;
    try {
      const response = await fetch(`/api/case/${code}/advance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ days }),
      });
      if (!response.ok) throw new Error("advance");
      const result = (await response.json()) as CaseResponse;
      setData(result);
      if (result.fired?.includes("deemed_refusal")) {
        setNotice(rtiCopy.tracker.fired);
      }
    } catch {
      setError(rtiCopy.common.error);
    } finally {
      setPending(false);
    }
  }

  async function simulate() {
    setSyncPending(true);
    setSyncError(null);
    setSyncSummary(null);
    try {
      const response = await fetch("/api/simulate-sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const result = (await response.json()) as {
        plan?: Plan;
        nodes?: RenderedNode[];
        events?: unknown[];
        unlocked?: string[];
        error?: string;
      };
      if (!response.ok) throw new Error(result.error || trackerCopy.control.failure);
      if (!result.plan || !result.nodes) throw new Error(trackerCopy.control.failure);
      setData({ case: result.plan, nodes: result.nodes });
      setSyncSummary(
        trackerCopy.control.updateSummary(result.events?.length ?? 0),
      );
    } catch (caught) {
      setSyncError(
        caught instanceof Error ? caught.message : trackerCopy.control.failure,
      );
    } finally {
      setSyncPending(false);
    }
  }

  if (error) return <p className="rti-error">{error}</p>;
  if (!data) return <p className="rti-loading">{rtiCopy.common.loading}</p>;

  // The engine decides all of this. Nothing here is asserted by the component.
  const deemed = data.nodes.find((node) => node.id === "deemed_refusal");
  const firstAppeal = data.nodes.find((node) => node.id === "first_appeal");
  const hasLapsed = Boolean(deemed?.fired);
  const appealStatus = data.case.statuses.first_appeal ?? "none";
  const appealFiled = appealStatus !== "none";
  // Once silence is a refusal, the next real event depends on the citizen
  // filing the appeal, so advancing time further would change nothing.
  const advanceBlocked = hasLapsed && !appealFiled;

  return (
    <section className="rti-case-page">
      <PageHero
        eyebrow={rtiCopy.tracker.eyebrow}
        illustration="/illustrations/tracker.png"
        supporting={
          hasLapsed && deemed?.summary
            ? deemed.summary
            : data.case.answers.lifeLiberty === "yes"
              ? rtiCopy.tracker.libertyReason
              : rtiCopy.tracker.ordinaryReason
        }
        title={rtiCopy.tracker.heading}
        tone="violet"
      />
      <div className="rti-case-content">
        <section className="rti-case-overlap rti-overlap-card">
          <CaseFacts code={code} plan={data.case} />
          <Clock lapsed={hasLapsed} nodes={data.nodes} plan={data.case} />
          {hasLapsed ? (
            <section className={appealFiled ? "rti-escalation is-filed" : "rti-escalation"} role="status">
              <FilledIcon seed="case:deemed-refusal" />
              <div className="rti-escalation__copy">
                <p className="rti-escalation__eyebrow">{rtiCopy.tracker.lapsed.eyebrow}</p>
                <h2>{appealFiled ? rtiCopy.tracker.lapsed.filedHeading : rtiCopy.tracker.lapsed.heading}</h2>
                <p>{appealFiled ? rtiCopy.tracker.lapsed.filedBody : deemed?.summary}</p>
                {!appealFiled && firstAppeal?.clock ? (
                  <p className="rti-escalation__deadline">
                    {rtiCopy.tracker.lapsed.deadline(firstAppeal.clock.label, firstAppeal.clock.days ?? 0)}
                  </p>
                ) : null}
                <Link className="rti-primary" href="/appeal/first">
                  {appealFiled ? rtiCopy.tracker.lapsed.filedAction : rtiCopy.tracker.lapsed.action}
                </Link>
                <small>{deemed?.sourceLabel}</small>
              </div>
            </section>
          ) : null}
          <div className="rti-time-control">
            <button className="rti-primary" disabled={pending || advanceBlocked} onClick={advance} type="button">
              {pending ? rtiCopy.common.loading : rtiCopy.tracker.next}
            </button>
            <p>{advanceBlocked ? rtiCopy.tracker.advanceBlocked : rtiCopy.tracker.nextNote}</p>
          </div>
          {notice ? <p className="rti-fired-notice" role="status">{notice}</p> : null}
        </section>
        <ProcessFlowchart nodes={data.nodes} plan={data.case} />
        <div className="rti-node-groups">
          {groups.map((group) => (
            <section key={group.bucket}>
              <h2>{rtiCopy.tracker.buckets[group.bucket]}</h2>
              <div className="rti-node-list">
                {group.nodes.map((node) => {
                  const nodeHref = node.id === "first_appeal"
                    ? "/appeal/first"
                    : node.id === "second_appeal"
                      ? "/appeal/second"
                      : node.id === "section_18_complaint"
                        ? "/complaint"
                        : `/case/${code}/${node.id}`;
                  const dependencies = node.dependsOn
                    .map((id) => data.nodes.find((item) => item.id === id)?.title)
                    .filter(Boolean)
                    .join(", ");
                  const nodeStatus = data.case.statuses[node.id] ?? "none";
                  // A node that has fired has happened in law even though the
                  // citizen never set a status on it, so it must not read as
                  // "Not started".
                  const statusLabel = nodeStatus !== "none"
                    ? rtiCopy.tracker.statuses[nodeStatus]
                    : node.fired
                      ? rtiCopy.tracker.occurred
                      : node.lapsed
                        ? rtiCopy.tracker.windowClosed
                        : rtiCopy.tracker.statuses[nodeStatus];
                  const stateClass = node.locked
                    ? "is-locked"
                    : nodeStatus === "done" || node.lapsed
                      ? "is-done"
                      : node.fired || nodeStatus === "applied"
                        ? "is-current"
                        : "is-available";
                  return (
                    <article className={`rti-node ${stateClass}`} key={node.id}>
                      <FilledIcon seed={`case-list:${node.id}`} />
                      <div className="rti-node__top">
                        <JobTag job={node.job} />
                        <span>{rtiCopy.tracker.status}: {statusLabel}</span>
                      </div>
                      <h3>{node.title}</h3>
                      <p>{node.summary}</p>
                      {node.locked ? (
                        <small>{rtiCopy.tracker.locked} {dependencies}</small>
                      ) : (
                        <Link href={nodeHref}>{rtiCopy.common.continue}</Link>
                      )}
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
        <TrackerPanel
          error={syncError}
          events={data.case.syncEvents}
          isPending={syncPending}
          onSimulate={simulate}
          summary={syncSummary}
        />
      </div>
    </section>
  );
}

export function CaseNodeDetail({
  code,
  nodeId,
}: {
  code: string;
  nodeId: string;
}) {
  const [data, setData] = useState<CaseResponse | null>(null);
  const [status, setStatus] = useState<Status>("none");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/case/${code}`)
      .then((response) => {
        if (!response.ok) throw new Error("case");
        return response.json();
      })
      .then((result: CaseResponse) => {
        if (cancelled) return;
        setData(result);
        setStatus(result.case.statuses[nodeId] ?? "none");
      })
      .catch(() => {
        if (!cancelled) setError(rtiCopy.api.notFound);
      });
    return () => {
      cancelled = true;
    };
  }, [code, nodeId]);

  const node = data?.nodes.find((item) => item.id === nodeId);

  async function save() {
    const response = await fetch(`/api/case/${code}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nodeId, status }),
    });
    if (!response.ok) {
      setError(rtiCopy.common.error);
      return;
    }
    const result = (await response.json()) as CaseResponse;
    setData(result);
    setSaved(rtiCopy.detail.save);
  }

  if (error) return <p className="rti-error">{error}</p>;
  if (!data) return <p className="rti-loading">{rtiCopy.common.loading}</p>;
  if (!node) return <p className="rti-error">{rtiCopy.detail.missing}</p>;

  return (
    <article className="rti-detail-page">
      <PageHero
        eyebrow={rtiCopy.tracker.jobs[node.job]}
        illustration="/illustrations/tracker.png"
        supporting={node.summary}
        title={node.title}
        tone="violet"
      />
      <div className="rti-detail-content rti-overlap-card">
        <Link className="rti-back-link" href={`/case/${code}`}>{rtiCopy.detail.back}</Link>
        <FilledIcon seed={`case-detail:${node.id}`} />
        <div className="rti-node__top"><JobTag job={node.job} /></div>
        <dl>
          <div><dt>{rtiCopy.detail.authority}</dt><dd>{node.authority}</dd></div>
          <div><dt>{rtiCopy.detail.basis}</dt><dd>{node.sourceLabel}</dd></div>
        </dl>
        <section>
          <h2>{rtiCopy.detail.expect}</h2>
          <p>{node.body}</p>
        </section>
        {node.warnings.map((warning) => (
          <div className={`rti-warning rti-warning--${warning.severity}`} key={warning.text}>{warning.text}</div>
        ))}
        <section className="rti-status-control">
          <label className="rti-field">
            <span>{rtiCopy.detail.status}</span>
            <select onChange={(event) => setStatus(event.target.value as Status)} value={status}>
              {(Object.keys(rtiCopy.tracker.statuses) as Status[]).map((value) => (
                <option key={value} value={value}>{rtiCopy.tracker.statuses[value]}</option>
              ))}
            </select>
          </label>
          <button className="rti-primary" disabled={node.locked} onClick={save} type="button">{rtiCopy.detail.save}</button>
          {saved ? <p role="status">{saved}</p> : null}
        </section>
        <div className="rti-source-line">
          <a href={node.sourceUrl} rel="noreferrer" target="_blank">{rtiCopy.detail.source}</a>
          <small>{node.verifiedOn}</small>
        </div>
      </div>
    </article>
  );
}
