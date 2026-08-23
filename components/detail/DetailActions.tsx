"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { journeyCopy } from "@/content/journey-copy";
import type { Plan, RenderedNode, Status } from "@/lib/engine/types";
import { AckInput } from "./AckInput";

interface DetailActionsProps {
  code: string;
  initialAck: string;
  initialStatus: Status;
  nodeId: string;
  sourceUrl: string;
  authority: string;
  planHref: string;
}

interface PatchResponse {
  plan: Plan;
  nodes: RenderedNode[];
  unlocked: string[];
}

export function DetailActions({
  code,
  initialAck,
  initialStatus,
  nodeId,
  sourceUrl,
  authority,
  planHref,
}: DetailActionsProps) {
  const [status, setStatus] = useState(initialStatus);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(initialStatus === "done");
  const [unlockedTitles, setUnlockedTitles] = useState<string[]>([]);
  const [returned, setReturned] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const openedService = useRef(false);

  useEffect(() => {
    function markReturned() {
      if (openedService.current) {
        setReturned(true);
      }
    }

    function onVisibilityChange() {
      if (document.visibilityState === "visible") {
        markReturned();
      }
    }

    window.addEventListener("focus", markReturned);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener("focus", markReturned);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  async function update(patch: { status?: Status; ack?: string }) {
    setPending(true);
    setError(null);

    try {
      const response = await fetch(`/api/plan/${code}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nodeId, ...patch }),
      });
      const result = (await response.json()) as PatchResponse | { error: string };

      if (!response.ok || !("plan" in result)) {
        throw new Error("Plan update failed");
      }

      setStatus(result.plan.statuses[nodeId] ?? "none");

      if (patch.ack !== undefined) {
        setSaved(true);
        setUnlockedTitles(
          result.unlocked.flatMap((unlockedId) => {
            const node = result.nodes.find((candidate) => candidate.id === unlockedId);
            return node ? [node.title] : [];
          }),
        );
      }
      return result;
    } catch {
      setError(journeyCopy.detail.error);
      return null;
    } finally {
      setPending(false);
    }
  }

  async function approveAfterFiling() {
    const applied = await update({ status: "applied" });
    if (!applied) return;

    setNotice(journeyCopy.detail.appliedWaiting);
    await new Promise((resolve) => window.setTimeout(resolve, 1_100));

    try {
      const response = await fetch("/api/simulate-sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, nodeId, mode: "filed-approval" }),
      });
      const result = (await response.json()) as PatchResponse & {
        error?: string;
      };

      if (!response.ok || !("plan" in result)) {
        throw new Error("Approval simulation failed");
      }

      setStatus(result.plan.statuses[nodeId] ?? "none");
      setUnlockedTitles(
        result.unlocked.flatMap((unlockedId) => {
          const node = result.nodes.find(
            (candidate) => candidate.id === unlockedId,
          );
          return node ? [node.title] : [];
        }),
      );
      setNotice(journeyCopy.detail.approved);
    } catch {
      setError(journeyCopy.detail.error);
    }
  }

  async function answerReturn(answer: "not-yet" | "stuck") {
    const result = await update({
      status: answer === "stuck" ? "stuck" : "none",
    });
    if (result) {
      setNotice(
        answer === "stuck"
          ? journeyCopy.detail.stuckSaved
          : journeyCopy.detail.notYetSaved,
      );
    }
  }

  return (
    <section className="detail-section detail-actions">
      <h2>{journeyCopy.detail.status}</h2>
      <p className={`task-status task-status--${status}`}>
        {journeyCopy.list.status[status]}
      </p>
      <a
        className="service-out-link"
        href={sourceUrl}
        onClick={() => {
          openedService.current = true;
          window.setTimeout(() => setReturned(true), 500);
        }}
        rel="noreferrer"
        target="_blank"
      >
        {journeyCopy.detail.openService(authority)}
        <span aria-hidden="true">↗</span>
      </a>
      <p className="service-out-note">{journeyCopy.detail.openServiceNote}</p>

      {returned && status !== "done" ? (
        <div className="return-check" role="group" aria-label={journeyCopy.detail.returnQuestion}>
          <strong>{journeyCopy.detail.returnQuestion}</strong>
          <div>
            <button disabled={pending} onClick={approveAfterFiling} type="button">
              {journeyCopy.detail.returnOptions.yes}
            </button>
            <button disabled={pending} onClick={() => answerReturn("not-yet")} type="button">
              {journeyCopy.detail.returnOptions.notYet}
            </button>
            <button disabled={pending} onClick={() => answerReturn("stuck")} type="button">
              {journeyCopy.detail.returnOptions.stuck}
            </button>
          </div>
        </div>
      ) : null}

      {notice ? <p className="saved-notice" role="status">{notice}</p> : null}
      {status === "done" ? (
        <Link className="detail-plan-link" href={planHref}>
          {journeyCopy.detail.viewUpdate}
        </Link>
      ) : null}
      <AckInput
        disabled={pending || status === "done"}
        initialValue={initialAck}
        onSave={(ack) => update({ ack })}
      />
      {saved && !notice ? <p className="saved-notice" role="status">{journeyCopy.detail.saved}</p> : null}
      {unlockedTitles.length > 0 ? (
        <div className="unlocked-notice" role="status">
          <strong>{journeyCopy.detail.unlockedHeading}</strong>
          <ul>
            {unlockedTitles.map((title) => <li key={title}>{title}</li>)}
          </ul>
        </div>
      ) : null}
      {error ? <p className="form-error" role="alert">{error}</p> : null}
    </section>
  );
}
