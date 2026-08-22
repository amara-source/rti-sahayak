import { journeyCopy } from "@/content/journey-copy";
import type { RuleNode } from "@/lib/engine/types";
import { ConfidenceBadge } from "@/components/shared/ConfidenceBadge";
import { JobTag } from "@/components/list/JobTag";

export function NodeHeader({ node }: { node: RuleNode }) {
  return (
    <header className="node-header">
      <div className="task-row__badges">
        <JobTag job={node.job} />
        {node.confidence === "conflicted" ? <ConfidenceBadge /> : null}
      </div>
      <h1>{node.title}</h1>
      <dl>
        <div>
          <dt>{journeyCopy.detail.authority}</dt>
          <dd>{node.authority}</dd>
        </div>
        <div>
          <dt>{journeyCopy.detail.typicalTime}</dt>
          <dd>{node.typicalDays}</dd>
        </div>
      </dl>
    </header>
  );
}
