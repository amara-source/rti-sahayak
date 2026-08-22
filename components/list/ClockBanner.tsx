import { journeyCopy } from "@/content/journey-copy";
import type { Clock } from "@/lib/engine/types";

export function ClockBanner({ clock }: { clock: Clock }) {
  return (
    <p className="clock-banner">
      {journeyCopy.list.clock(
        clock.label,
        clock.days,
        journeyCopy.list.clockStart[clock.from],
      )}
    </p>
  );
}
