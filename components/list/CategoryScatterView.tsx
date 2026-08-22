import { serviceCategory } from "@/content/service-categories";
import type { RenderedNode, Status } from "@/lib/engine/types";
import { TaskRow } from "./TaskRow";

interface CategoryScatterViewProps {
  code: string;
  nodes: RenderedNode[];
  statuses: Record<string, Status>;
}

export function CategoryScatterView({
  code,
  nodes,
  statuses,
}: CategoryScatterViewProps) {
  const grouped = new Map<
    string,
    { label: string; nodes: RenderedNode[] }
  >();

  for (const node of nodes) {
    const category = serviceCategory(node.id);
    const group = grouped.get(category.id) ?? {
      label: category.label,
      nodes: [],
    };
    group.nodes.push(node);
    grouped.set(category.id, group);
  }

  return (
    <div className="scatter-view">
      {Array.from(grouped.entries()).map(([categoryId, group]) => (
        <section className="plan-group" key={categoryId}>
          <h2 className="bucket-header">{group.label}</h2>
          <div className="task-list">
            {group.nodes.map((node) => (
              <TaskRow
                code={code}
                dependencyTitles={node.dependsOn.map(
                  (dependencyId) =>
                    nodes.find((candidate) => candidate.id === dependencyId)
                      ?.title ?? dependencyId,
                )}
                key={node.id}
                node={node}
                status={statuses[node.id] ?? "none"}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
