import Link from "next/link";
import { journeyCopy } from "@/content/journey-copy";
import { ConfidenceBadge } from "@/components/shared/ConfidenceBadge";
import type { RenderedNode, Status } from "@/lib/engine/types";
import { citizenSafeRuleText } from "@/lib/presentation/rule-text";
import { ClockBanner } from "./ClockBanner";
import { JobTag } from "./JobTag";
import { LockedRow } from "./LockedRow";

interface TaskRowProps {
  code: string;
  dependencyTitles: string[];
  highlighted: boolean;
  node: RenderedNode;
  status: Status;
}

export function TaskRow({
  code,
  dependencyTitles,
  highlighted,
  node,
  status,
}: TaskRowProps) {
  if (node.locked) {
    return (
      <LockedRow
        dependencyTitles={dependencyTitles}
        node={node}
        status={status}
      />
    );
  }

  return (
    <Link
      className={`task-row${highlighted ? " task-row--highlighted" : ""}`}
      href={`/node/${node.id}?code=${code}`}
    >
      <span className="task-row__topline">
        <span className="task-row__badges">
          <JobTag job={node.job} />
          {node.confidence === "conflicted" ? <ConfidenceBadge /> : null}
        </span>
        <span className={`task-status task-status--${status}`}>
          {journeyCopy.list.status[status]}
        </span>
      </span>
      <strong className="task-row__title">{node.title}</strong>
      <span className="task-row__summary">
        {citizenSafeRuleText(node.summary)}
      </span>
      <span className="task-row__authority">{node.authority}</span>
      {node.warnings.length > 0 ? (
        <span className="task-warning-count">
          {journeyCopy.list.warningCount(node.warnings.length)}
        </span>
      ) : null}
      {node.statutoryClock ? <ClockBanner clock={node.statutoryClock} /> : null}
    </Link>
  );
}
