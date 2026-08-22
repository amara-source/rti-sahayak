import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JourneyIntake } from "@/components/intake/JourneyIntake";
import { landingCopy } from "@/content/landing-copy";
import { allLandingEvents } from "@/content/landing-events";
import { drivenIntakeQuestions } from "@/lib/engine/intake";
import { loadEventRulePack } from "@/lib/engine/journey";

interface EventPageProps {
  params: Promise<{ eventId: string }>;
}

function findEvent(eventId: string) {
  return allLandingEvents.find((event) => event.eventId === eventId);
}

export function generateStaticParams() {
  return allLandingEvents.map((event) => ({ eventId: event.eventId }));
}

export async function generateMetadata({
  params,
}: EventPageProps): Promise<Metadata> {
  const { eventId } = await params;
  const event = findEvent(eventId);

  return event ? { title: event.label } : {};
}

export default async function EventPage({ params }: EventPageProps) {
  const { eventId } = await params;
  const event = findEvent(eventId);

  if (!event) {
    notFound();
  }

  if (event.tier === 1) {
    const pack = loadEventRulePack(event.eventId);
    const questions = drivenIntakeQuestions(pack);
    if (questions.length === 0) {
      notFound();
    }

    return (
      <JourneyIntake
        eventId={event.eventId}
        eventLabel={event.label}
        questions={questions}
      />
    );
  }

  return (
    <section className="event-detail-page">
      <div className="site-shell event-detail-page__inner">
        <article className="event-detail-card">
          <p className="event-detail-card__cluster">{event.cluster}</p>
          <h1>{event.label}</h1>
          {event.description ? <p>{event.description}</p> : null}
          <p className="mapped-marker">
            {landingCopy.lifeEvents.mappedMarker}
          </p>
        </article>
      </div>
    </section>
  );
}
