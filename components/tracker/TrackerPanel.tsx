import type { SyncEvent } from "@/lib/engine/types";
import { SyncControl } from "./SyncControl";
import { SyncFeed } from "./SyncFeed";
import { WhatsAppPanel } from "./WhatsAppPanel";

interface TrackerPanelProps {
  error: string | null;
  events: SyncEvent[];
  isPending: boolean;
  onSimulate: () => void;
  summary: string | null;
}

export function TrackerPanel({
  error,
  events,
  isPending,
  onSimulate,
  summary,
}: TrackerPanelProps) {
  return (
    <aside className="tracker-panel">
      <SyncControl
        error={error}
        isPending={isPending}
        onSimulate={onSimulate}
        summary={summary}
      />
      <WhatsAppPanel events={events} />
      <SyncFeed events={events} />
    </aside>
  );
}
