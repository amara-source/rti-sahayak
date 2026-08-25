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

function Clock({ plan, nodes }: { plan: Plan; nodes: RenderedNode[] }) {
  const reply = nodes.find((node) => node.id === "await_reply");
  const lifeLiberty = plan.answers.lifeLiberty === "yes";
  const elapsed = plan.elapsedHours ?? 0;
  const limit = lifeLiberty ? 48 : 30 * 24;
  const elapsedValue = lifeLiberty ? elapsed : Math.floor(elapsed / 24);
  const remainingValue = lifeLiberty
    ? Math.max(0, limit - elapsed)
    : Math.max(0, 30 - Math.floor(elapsed / 24));
  const unit = lifeLiberty ? rtiCopy.tracker.hours : rtiCopy.tracker.days;

  return (
    <section className="rti-clock">
      <div>
        <span>{rtiCopy.tracker.elapsed}</span>
        <strong>{elapsedValue}</strong>
        <small>{unit}</small>
      </div>
      <div>
        <span>{rtiCopy.tracker.remaining}</span>
        <strong>{remainingValue}</strong>
        <small>{unit}</small>
      </div>
      <div className="rti-clock__reason">
        <strong>{reply?.clock?.label}</strong>
        <p>{lifeLiberty ? rtiCopy.tracker.libertyReason : rtiCopy.tracker.ordinaryReason}</p>
      </div>
    </section>
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

  return (
    <section className="rti-case-page">
      <PageHero
        eyebrow={rtiCopy.tracker.eyebrow}
        illustration="/illustrations/tracker.png"
        supporting={data.case.answers.lifeLiberty === "yes" ? rtiCopy.tracker.libertyReason : rtiCopy.tracker.ordinaryReason}
        title={rtiCopy.tracker.heading}
        tone="violet"
      />
      <div className="rti-case-content">
        <section className="rti-case-overlap rti-overlap-card">
          <p className="rti-case-code">{rtiCopy.tracker.planCode}: {code}</p>
          <Clock plan={data.case} nodes={data.nodes} />
          <div className="rti-time-control">
            <button className="rti-primary" disabled={pending} onClick={advance} type="button">
              {pending ? rtiCopy.common.loading : rtiCopy.tracker.next}
            </button>
            <p>{rtiCopy.tracker.nextNote}</p>
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
                  return (
                    <article className={node.locked ? "rti-node is-locked" : "rti-node"} key={node.id}>
                      <FilledIcon seed={`case-list:${node.id}`} />
                      <div className="rti-node__top">
                        <JobTag job={node.job} />
                        <span>{rtiCopy.tracker.status}: {rtiCopy.tracker.statuses[data.case.statuses[node.id] ?? "none"]}</span>
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
