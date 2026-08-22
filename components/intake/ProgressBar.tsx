import { journeyCopy } from "@/content/journey-copy";

interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  return (
    <div className="intake-progress">
      <p>{journeyCopy.intake.progress(current, total)}</p>
      <progress aria-label={journeyCopy.intake.progress(current, total)} max={total} value={current} />
    </div>
  );
}
