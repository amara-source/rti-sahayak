import { journeyCopy } from "@/content/journey-copy";
import { ConfidenceBadge } from "@/components/shared/ConfidenceBadge";
import { MockBadge } from "@/components/shared/MockBadge";
import type { RenderedNode, Status } from "@/lib/engine/types";
import { citizenSafeRuleText } from "@/lib/presentation/rule-text";
import { ClockBanner } from "./ClockBanner";
import { JobTag } from "./JobTag";

interface LockedRowProps {
  node: RenderedNode;
  simulated: boolean;
  dependencyTitles: string[];
  status: Status;
}

export function LockedRow({
  node,
  simulated,
  dependencyTitles,
  status,
}: LockedRowProps) {
  return (
    <div
      aria-disabled="true"
      className="task-row task-row--locked"
      role="link"
    >
      <div className="task-row__topline">
        <span className="task-row__badges">
          <JobTag job={node.job} />
          {node.confidence === "conflicted" ? <ConfidenceBadge /> : null}
          {simulated ? <MockBadge /> : null}
        </span>
        <span className={`task-status task-status--${status}`}>
          {journeyCopy.list.status[status]}
        </span>
      </div>
      <h3>{node.title}</h3>
      <p>{citizenSafeRuleText(node.summary)}</p>
      {node.statutoryClock ? <ClockBanner clock={node.statutoryClock} /> : null}
      <strong className="locked-reason">
        {journeyCopy.list.lockedReason(dependencyTitles.join(", "))}
      </strong>
    </div>
  );
}
