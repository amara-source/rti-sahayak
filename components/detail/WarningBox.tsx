import { journeyCopy } from "@/content/journey-copy";
import type { Warning } from "@/lib/engine/types";

export function WarningBox({ warning }: { warning: Warning }) {
  return (
    <div className={`warning-box warning-box--${warning.severity}`}>
      <strong>{journeyCopy.detail.severity[warning.severity]}</strong>
      <p>{warning.text}</p>
    </div>
  );
}
