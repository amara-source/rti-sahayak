import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { BelongCard } from "@/components/detail/BelongCard";
import { Checklist } from "@/components/detail/Checklist";
import { DetailActions } from "@/components/detail/DetailActions";
import { NodeHeader } from "@/components/detail/NodeHeader";
import { RouteList } from "@/components/detail/RouteList";
import { SourceLine } from "@/components/detail/SourceLine";
import { WarningBox } from "@/components/detail/WarningBox";
import { ClockBanner } from "@/components/list/ClockBanner";
import { journeyCopy } from "@/content/journey-copy";
import { computeJourney } from "@/lib/engine/journey";
import { citizenSafeRuleText } from "@/lib/presentation/rule-text";
import { cookiePlanStorage } from "@/lib/plans/storage";

interface NodePageProps {
  params: Promise<{ nodeId: string }>;
  searchParams: Promise<{ code?: string }>;
}

export async function generateMetadata({
  params,
}: NodePageProps): Promise<Metadata> {
  const { nodeId } = await params;
  const storage = cookiePlanStorage(await cookies());
  const plan = await storage.load();
  const node = plan
    ? computeJourney(plan.eventId, plan.answers, plan.statuses).find(
        (candidate) => candidate.id === nodeId,
      )
    : undefined;

  return node ? { title: node.title } : {};
}

export default async function NodePage({ params, searchParams }: NodePageProps) {
  const { nodeId } = await params;
  const { code } = await searchParams;
  const storage = cookiePlanStorage(await cookies());
  const plan = await storage.load();

  if (!plan || !code || plan.code !== code) {
    notFound();
  }

  const nodes = computeJourney(plan.eventId, plan.answers, plan.statuses);
  const node = nodes.find((candidate) => candidate.id === nodeId);

  if (!node || node.locked) {
    notFound();
  }

  const dependencies = node.dependsOn.flatMap((dependencyId) => {
    const dependency = nodes.find((candidate) => candidate.id === dependencyId);
    return dependency ? [dependency.title] : [];
  });
  const dependents = nodes
    .filter((candidate) => candidate.dependsOn.includes(node.id))
    .map((candidate) => candidate.title);

  return (
    <section className="node-page">
      <div className="site-shell node-page__inner">
        <Link
          className="back-link"
          href={`/events/${plan.eventId}/list?code=${plan.code}`}
        >
          {journeyCopy.detail.back}
        </Link>
        <article className="node-detail-card">
          <NodeHeader node={node} />
          {node.statutoryClock ? <ClockBanner clock={node.statutoryClock} /> : null}

          <section className="detail-section">
            <h2>{journeyCopy.detail.bodyHeading}</h2>
            <p>{citizenSafeRuleText(node.body)}</p>
          </section>

          {node.warnings.length > 0 ? (
            <section className="detail-section warning-list">
              <h2>{journeyCopy.detail.warnings}</h2>
              {node.warnings.map((warning) => (
                <WarningBox key={warning.text} warning={warning} />
              ))}
            </section>
          ) : null}

          <RouteList dependencies={dependencies} dependents={dependents} />
          <Checklist documents={node.documents} />

          {node.belongResources?.map((resource) => (
            <BelongCard key={resource.label} resource={resource} />
          ))}

          <DetailActions
            code={plan.code}
            initialAck={plan.acks[node.id] ?? ""}
            initialStatus={plan.statuses[node.id] ?? "none"}
            nodeId={node.id}
          />

          <SourceLine
            sourceLabel={node.sourceLabel}
            sourceUrl={node.sourceUrl}
            verifiedOn={node.verifiedOn}
          />
        </article>
      </div>
    </section>
  );
}
