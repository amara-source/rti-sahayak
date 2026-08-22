"use client";

import { useState } from "react";
import { journeyCopy } from "@/content/journey-copy";
import type { Bucket, RenderedNode, Status } from "@/lib/engine/types";
import { BucketHeader } from "./BucketHeader";
import { CategoryScatterView } from "./CategoryScatterView";
import { TaskRow } from "./TaskRow";

interface CompareToggleProps {
  code: string;
  nodes: RenderedNode[];
  statuses: Record<string, Status>;
}

const bucketOrder: Bucket[] = ["urgent", "before", "week1", "month", "later"];

export function CompareToggle({ code, nodes, statuses }: CompareToggleProps) {
  const [view, setView] = useState<"ordered" | "categories">("ordered");

  return (
    <>
      <div className="compare-control">
        <div className="compare-toggle">
          <button
            aria-pressed={view === "ordered"}
            onClick={() => setView("ordered")}
            type="button"
          >
            {journeyCopy.list.orderedView}
          </button>
          <button
            aria-pressed={view === "categories"}
            onClick={() => setView("categories")}
            type="button"
          >
            {journeyCopy.list.categoryView}
          </button>
        </div>
        <p>
          {view === "ordered"
            ? journeyCopy.list.orderedDescription
            : journeyCopy.list.categoryDescription}
        </p>
      </div>

      {view === "categories" ? (
        <CategoryScatterView code={code} nodes={nodes} statuses={statuses} />
      ) : (
        <div className="ordered-view">
          {bucketOrder.map((bucket) => {
            const bucketNodes = nodes.filter((node) => node.bucket === bucket);

            return bucketNodes.length > 0 ? (
              <section className="plan-group" key={bucket}>
                <BucketHeader bucket={bucket} />
                <div className="task-list">
                  {bucketNodes.map((node) => (
                    <TaskRow
                      code={code}
                      dependencyTitles={node.dependsOn.map(
                        (dependencyId) =>
                          nodes.find(
                            (candidate) => candidate.id === dependencyId,
                          )?.title ?? dependencyId,
                      )}
                      key={node.id}
                      node={node}
                      status={statuses[node.id] ?? "none"}
                    />
                  ))}
                </div>
              </section>
            ) : null;
          })}
        </div>
      )}
    </>
  );
}
