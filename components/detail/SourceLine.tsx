import { journeyCopy } from "@/content/journey-copy";

interface SourceLineProps {
  sourceLabel: string;
  sourceUrl: string;
  verifiedOn: string;
}

export function SourceLine({
  sourceLabel,
  sourceUrl,
  verifiedOn,
}: SourceLineProps) {
  return (
    <footer className="source-line">
      <div>
        <strong>{journeyCopy.detail.source}</strong>
        <span>{sourceLabel}</span>
      </div>
      <span>{journeyCopy.detail.verified(verifiedOn)}</span>
      <a href={sourceUrl} rel="noreferrer" target="_blank">
        {journeyCopy.detail.openSource}
      </a>
    </footer>
  );
}
