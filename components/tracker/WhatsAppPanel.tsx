"use client";

import type { SyncEvent } from "@/lib/engine/types";
import { useCopy } from "@/lib/i18n/LanguageProvider";

interface WhatsAppPanelProps {
  events: SyncEvent[];
}

function eventTime(at: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  }).format(new Date(at));
}

export function WhatsAppPanel({ events }: WhatsAppPanelProps) {
  // Interface copy in the selected language, English where untranslated.
  const { tracker: trackerCopy } = useCopy();
  return (
    <section className="whatsapp-panel" aria-live="polite">
      <header className="whatsapp-panel__header">
        <span className="whatsapp-panel__avatar" aria-hidden="true">UP</span>
        <div>
          <h2>{trackerCopy.whatsapp.sender}</h2>
          <p>{trackerCopy.whatsapp.senderLine}</p>
        </div>
        <span className="whatsapp-panel__menu" aria-hidden="true">•••</span>
      </header>

      <div className="whatsapp-thread">
        {events.length === 0 ? (
          <p className="whatsapp-thread__empty">
            {trackerCopy.whatsapp.empty}
          </p>
        ) : (
          events.map((event, index) => (
            <article
              className="whatsapp-message"
              key={`${event.nodeId}-${event.at}-${index}`}
            >
              <strong>{event.from}</strong>
              <p>{event.message}</p>
              <footer>
                <span>{trackerCopy.status[event.status]}</span>
                <time dateTime={event.at}>{eventTime(event.at)}</time>
              </footer>
            </article>
          ))
        )}
      </div>

      <div className="whatsapp-panel__notes">
        <p><strong>{trackerCopy.whatsapp.renderedOnly}</strong></p>
        <p>{trackerCopy.whatsapp.platformConstraint}</p>
        <p>{trackerCopy.whatsapp.grounding}</p>
      </div>
    </section>
  );
}
