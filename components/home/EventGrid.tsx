import Link from "next/link";
import { AbstractIcon } from "@/components/home/AbstractIcon";
import { landingCopy } from "@/content/landing-copy";
import { lifeEventClusters } from "@/content/landing-events";

export function EventGrid() {
  return (
    <section className="landing-section life-events-section" id="life-events">
      <div className="site-shell">
        <div className="section-heading-row">
          <div>
            <h2>{landingCopy.lifeEvents.heading}</h2>
            <p>{landingCopy.lifeEvents.description}</p>
          </div>
          <a className="text-link" href="#life-events-grid">
            {landingCopy.lifeEvents.explore}
          </a>
        </div>

        <div className="event-cluster-grid" id="life-events-grid">
          {lifeEventClusters.map((cluster) => (
            <article className="event-cluster-card" key={cluster.name}>
              <div className="card-heading">
                <span className="icon-field">
                  <AbstractIcon name={cluster.icon} />
                </span>
                <h3>{cluster.name}</h3>
              </div>
              <ul>
                {cluster.events.map((event) => (
                  <li key={event.eventId}>
                    <Link
                      className="event-link"
                      href={`/events/${event.eventId}`}
                    >
                      <span>{event.label}</span>
                      {event.description ? <small>{event.description}</small> : null}
                    </Link>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
