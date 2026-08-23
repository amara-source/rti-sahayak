"use client";

import { useState } from "react";
import { trackerCopy } from "@/content/tracker-copy";
import type {
  Plan,
  RenderedNode,
  SyncEvent,
} from "@/lib/engine/types";
import { TrackerPanel } from "@/components/tracker/TrackerPanel";
import { CompareToggle } from "./CompareToggle";

interface PlanWorkspaceProps {
  code: string;
  initialNodes: RenderedNode[];
  initialPlan: Plan;
}

interface SyncResponse {
  plan: Plan;
  nodes: RenderedNode[];
  events: SyncEvent[];
  unlocked: string[];
  error?: string;
}

export function PlanWorkspace({
  code,
  initialNodes,
  initialPlan,
}: PlanWorkspaceProps) {
  const [nodes, setNodes] = useState(initialNodes);
  const [plan, setPlan] = useState(initialPlan);
  const [highlightedNodeIds, setHighlightedNodeIds] = useState<string[]>([]);
  const [isPending, setIsPending] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function simulate() {
    setIsPending(true);
    setError(null);
    setSummary(null);

    try {
      const response = await fetch("/api/simulate-sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const result = (await response.json()) as SyncResponse;

      if (!response.ok) {
        setError(result.error ?? trackerCopy.control.failure);
        return;
      }

      setPlan(result.plan);
      setNodes(result.nodes);
      setHighlightedNodeIds(result.unlocked);

      const unlockedTitles = result.unlocked.flatMap((nodeId) => {
        const node = result.nodes.find((candidate) => candidate.id === nodeId);
        return node ? [node.title] : [];
      });
      const updateSummary = trackerCopy.control.updateSummary(
        result.events.length,
      );
      setSummary(
        unlockedTitles.length > 0
          ? `${updateSummary} ${trackerCopy.control.unlockSummary(unlockedTitles)}`
          : updateSummary,
      );
    } catch {
      setError(trackerCopy.control.failure);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="plan-workspace">
      <div className="plan-workspace__tasks">
        <CompareToggle
          code={code}
          highlightedNodeIds={highlightedNodeIds}
          nodes={nodes}
          statuses={plan.statuses}
        />
      </div>
      <TrackerPanel
        error={error}
        events={plan.syncEvents}
        isPending={isPending}
        onSimulate={simulate}
        summary={summary}
      />
    </div>
  );
}
