import { journeyCopy } from "@/content/journey-copy";
import { ConfidenceBadge } from "@/components/shared/ConfidenceBadge";
import type { RenderedNode } from "@/lib/engine/types";
import { citizenSafeRuleText } from "@/lib/presentation/rule-text";

interface ProvisionalListPeekProps {
  nodes: RenderedNode[];
  changedIds: string[];
}

export function ProvisionalListPeek({
  nodes,
  changedIds,
}: ProvisionalListPeekProps) {
  const changed = new Set(changedIds);

  return (
    <div className="provisional-list">
      {nodes.map((node) => (
        <article
          className={changed.has(node.id) ? "provisional-row is-changed" : "provisional-row"}
          key={node.id}
        >
          <div>
            <span className={`job-tag job-tag--${node.job.toLowerCase()}`}>
              {node.job}
            </span>
            {node.confidence === "conflicted" ? <ConfidenceBadge /> : null}
            <h3>{node.title}</h3>
            <p>{citizenSafeRuleText(node.summary)}</p>
            {node.warnings.length > 0 ? (
              <ul className="provisional-warnings">
                {node.warnings.map((warning) => (
                  <li key={warning.text}>{warning.text}</li>
                ))}
              </ul>
            ) : null}
          </div>
          {node.warnings.length > 0 ? (
            <strong>{journeyCopy.list.warningCount(node.warnings.length)}</strong>
          ) : null}
        </article>
      ))}
    </div>
  );
}
