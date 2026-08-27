"use client";

import type { SyncEvent } from "@/lib/engine/types";
import { useCopy } from "@/lib/i18n/LanguageProvider";

interface SyncFeedProps {
  events: SyncEvent[];
}

function eventTime(at: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  }).format(new Date(at));
}

export function SyncFeed({ events }: SyncFeedProps) {
  // Interface copy in the selected language, English where untranslated.
  const { tracker: trackerCopy } = useCopy();
  return (
    <section className="sync-feed" aria-live="polite">
      <header>
        <h3>{trackerCopy.feed.heading}</h3>
      </header>

      {events.length === 0 ? (
        <p className="sync-feed__empty">{trackerCopy.feed.empty}</p>
      ) : (
        <ol>
          {events.map((event, index) => (
            <li key={`${event.nodeId}-${event.at}-${index}`}>
              <span className="sync-feed__status">
                {trackerCopy.status[event.status]}
              </span>
              <strong>{event.from}</strong>
              <time dateTime={event.at}>{eventTime(event.at)}</time>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
