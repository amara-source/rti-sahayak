"use client";

import { useState } from "react";
import { journeyCopy } from "@/content/journey-copy";
import type { Plan, RenderedNode, Status } from "@/lib/engine/types";
import { AckInput } from "./AckInput";
import { StatusSegment } from "./StatusSegment";

interface DetailActionsProps {
  code: string;
  initialAck: string;
  initialStatus: Status;
  nodeId: string;
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
}: DetailActionsProps) {
  const [status, setStatus] = useState(initialStatus);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(initialStatus === "done");
  const [unlockedTitles, setUnlockedTitles] = useState<string[]>([]);

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
    } catch {
      setError(journeyCopy.detail.error);
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="detail-section detail-actions">
      <h2>{journeyCopy.detail.status}</h2>
      {status === "done" ? (
        <p className="completion-state">{journeyCopy.list.status.done}</p>
      ) : (
        <StatusSegment
          disabled={pending}
          onChange={(nextStatus) => update({ status: nextStatus })}
          status={status}
        />
      )}
      <AckInput
        disabled={pending || status === "done"}
        initialValue={initialAck}
        onSave={(ack) => update({ ack })}
      />
      {saved ? <p className="saved-notice" role="status">{journeyCopy.detail.saved}</p> : null}
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
