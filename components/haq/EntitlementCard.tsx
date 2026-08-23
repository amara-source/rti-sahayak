import { SourceLine } from "@/components/detail/SourceLine";
import { WarningBox } from "@/components/detail/WarningBox";
import { JobTag } from "@/components/list/JobTag";
import { ConfidenceBadge } from "@/components/shared/ConfidenceBadge";
import { haqCopy } from "@/content/haq-copy";
import type { Entitlement, Profile } from "@/lib/engine/types";
import { renderWhyYouMayQualify } from "@/lib/haq/profile-facts";

interface EntitlementCardProps {
  entitlement: Entitlement;
  profile: Profile;
}

export function EntitlementCard({
  entitlement,
  profile,
}: EntitlementCardProps) {
  const whyYouMayQualify = renderWhyYouMayQualify(entitlement, profile);

  return (
    <article className="entitlement-card">
      <header className="entitlement-card__header">
        <div>
          <p>{haqCopy.results.cardFrame}</p>
          <h3>{entitlement.title}</h3>
        </div>
        <div className="entitlement-card__badges">
          <JobTag job={entitlement.job} />
          {entitlement.confidence === "conflicted" ? (
            <ConfidenceBadge />
          ) : null}
        </div>
      </header>

      <section className="entitlement-fact">
        <h4>{haqCopy.results.why}</h4>
        <p>{whyYouMayQualify}</p>
      </section>

      <section className="entitlement-card__section">
        <h4>{haqCopy.results.gives}</h4>
        <p>{entitlement.whatItGives}</p>
      </section>

      <section className="entitlement-card__section">
        <h4>{haqCopy.results.how}</h4>
        <ol>
          {entitlement.howToGet.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      {entitlement.warnings?.map((warning) => (
        <WarningBox key={warning.text} warning={warning} />
      ))}

      <dl className="entitlement-authority">
        <dt>{haqCopy.results.authority}</dt>
        <dd>{entitlement.authority}</dd>
      </dl>

      <SourceLine
        sourceLabel={entitlement.sourceLabel}
        sourceUrl={entitlement.sourceUrl}
        verifiedOn={entitlement.verifiedOn}
      />
    </article>
  );
}
