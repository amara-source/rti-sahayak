import { journeyCopy } from "@/content/journey-copy";
import type { Resource } from "@/lib/engine/types";
import { JobTag } from "@/components/list/JobTag";

export function BelongCard({ resource }: { resource: Resource }) {
  return (
    <aside className="belong-card">
      <JobTag job="BELONG" />
      <h2>{journeyCopy.detail.belongHeading}</h2>
      <strong>{resource.label}</strong>
      <p>{resource.note}</p>
      <a href={resource.sourceUrl} rel="noreferrer" target="_blank">
        {journeyCopy.detail.openSource}
      </a>
    </aside>
  );
}
