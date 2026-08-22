import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { CompareToggle } from "@/components/list/CompareToggle";
import { PlanHeader } from "@/components/list/PlanHeader";
import { computeJourney, loadEventRulePack } from "@/lib/engine/journey";
import { cookiePlanStorage } from "@/lib/plans/storage";

interface JourneyListPageProps {
  params: Promise<{ eventId: string }>;
  searchParams: Promise<{ code?: string }>;
}

export async function generateMetadata({
  params,
}: JourneyListPageProps): Promise<Metadata> {
  const { eventId } = await params;

  try {
    return { title: loadEventRulePack(eventId).label };
  } catch {
    return {};
  }
}

export default async function JourneyListPage({
  params,
  searchParams,
}: JourneyListPageProps) {
  const { eventId } = await params;
  const { code } = await searchParams;
  const storage = cookiePlanStorage(await cookies());
  const plan = await storage.load();

  if (!plan || !code || plan.code !== code || plan.eventId !== eventId) {
    notFound();
  }

  const pack = loadEventRulePack(eventId);
  const nodes = computeJourney(plan.eventId, plan.answers, plan.statuses);

  return (
    <section className="plan-page">
      <div className="site-shell plan-page__inner">
        <PlanHeader code={plan.code} eventLabel={pack.label} />
        <CompareToggle
          code={plan.code}
          nodes={nodes}
          statuses={plan.statuses}
        />
      </div>
    </section>
  );
}
