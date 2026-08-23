import { trackerCopy } from "@/content/tracker-copy";
import type { SyncEvent } from "@/lib/engine/types";

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
  return (
    <section className="whatsapp-panel" aria-live="polite">
      <header className="whatsapp-panel__header">
        <div>
          <p>{trackerCopy.whatsapp.eyebrow}</p>
          <h2>{trackerCopy.whatsapp.heading}</h2>
        </div>
      </header>

      <strong className="whatsapp-panel__rendered-only">
        {trackerCopy.whatsapp.renderedOnly}
      </strong>
      <p className="whatsapp-panel__description">
        {trackerCopy.whatsapp.description}
      </p>

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
              <div className="whatsapp-message__meta">
                <span>{trackerCopy.status[event.status]}</span>
              </div>
              <p>{event.message}</p>
              <time dateTime={event.at}>{eventTime(event.at)}</time>
            </article>
          ))
        )}
      </div>

      <p className="whatsapp-panel__constraint">
        {trackerCopy.whatsapp.platformConstraint}
      </p>
      <p className="whatsapp-panel__grounding">
        {trackerCopy.whatsapp.grounding}
      </p>
    </section>
  );
}
