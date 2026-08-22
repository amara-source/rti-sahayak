import { journeyCopy } from "@/content/journey-copy";

export function ConfidenceBadge() {
  return (
    <span className="confidence-badge" title={journeyCopy.detail.confidenceNote}>
      {journeyCopy.detail.confidenceBadge}
    </span>
  );
}
