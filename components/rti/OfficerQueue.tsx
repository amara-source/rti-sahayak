import Link from "next/link";
import { officerCopy } from "@/content/officer-copy";
import { officerQueue, queueCounts, type QueueRow } from "@/lib/rti/officer-queue";
import { nodeIcon } from "@/lib/rti/icon-map";
import { Icon } from "./Icon";
import { PageHero } from "./PageHero";

/**
 * The officer preview.
 *
 * A static page: no login, no session, nothing to authenticate. Every number
 * on it comes from the same engine and the same rule pack as the citizen
 * journey, so the two sides of a case can never disagree.
 */
function unit(row: QueueRow, value: number): string {
  return row.lifeLiberty ? officerCopy.hours : officerCopy.days;
}

function QueueCard({ row }: { row: QueueRow }) {
  const overdue = row.status === "overdue";
  return (
    <article className={`rti-node officer-row officer-row--${row.status}`}>
      <div className="rti-node__top">
        <span className="rti-icon-tile rti-icon-tile--sm">
          <Icon name={nodeIcon(row.currentNode?.id ?? "await_reply")} />
        </span>
        <span className={`rti-job officer-status officer-status--${row.status}`}>
          {officerCopy.statuses[row.status]}
        </span>
      </div>
      <h3>{row.subject}</h3>
      <p className="officer-row__registration">{row.registration}</p>
      <dl className="officer-row__facts">
        <div>
          <dt>{officerCopy.columns.authority}</dt>
          <dd>{row.authority}</dd>
        </div>
        <div>
          <dt>{officerCopy.columns.currentStep}</dt>
          <dd>{row.currentNode?.title ?? "—"}</dd>
        </div>
      </dl>
      {/* The same clock panel the citizen sees, in the same two states. */}
      <section className={overdue ? "rti-clock is-lapsed" : "rti-clock"}>
        <div>
          <span>{officerCopy.columns.elapsed}</span>
          <strong>{row.clock.elapsed}</strong>
          <small>{unit(row, row.clock.elapsed)}</small>
        </div>
        <div>
          <span>{overdue ? officerCopy.columns.overdue : officerCopy.columns.remaining}</span>
          <strong>{overdue ? row.clock.overdue : row.clock.remaining}</strong>
          <small>{unit(row, overdue ? row.clock.overdue : row.clock.remaining)}</small>
        </div>
      </section>
    </article>
  );
}

export function OfficerQueue() {
  const rows = officerQueue();
  const counts = queueCounts(rows);

  return (
    <article className="utility-page officer-page">
      <PageHero
        eyebrow={officerCopy.eyebrow}
        illustration="/illustrations/tracker.png"
        supporting={officerCopy.intro}
        title={officerCopy.heading}
        tone="violet"
      />
      <div className="utility-page__content rti-overlap-card">
        <section className="officer-counts" aria-label={officerCopy.queueLabel}>
          <div className="officer-count">
            <strong>{counts.dueThisWeek}</strong>
            <span>{officerCopy.counts.dueThisWeek}</span>
          </div>
          <div className="officer-count officer-count--overdue">
            <strong>{counts.overdue}</strong>
            <span>{officerCopy.counts.overdue}</span>
          </div>
          <div className="officer-count officer-count--overdue">
            <strong>{counts.pastDeemedRefusal}</strong>
            <span>{officerCopy.counts.pastDeemedRefusal}</span>
          </div>
        </section>

        <div className="rti-node-list officer-queue">
          {rows.map((row) => (
            <QueueCard key={row.registration} row={row} />
          ))}
        </div>

        <p className="rti-note officer-disclaimer">{officerCopy.disclaimer}</p>
        <p className="rti-note">
          <Link href="/honesty">{"How this prototype works"}</Link>
        </p>
      </div>
    </article>
  );
}
