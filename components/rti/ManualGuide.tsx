import { manualCopy } from "@/content/utility-copy";
import { PageHero } from "./PageHero";
import { FilledIcon } from "./FilledIcon";

const assetOrigin = "https://you-are-building-a-working-web.vercel.app";

export function ManualGuide() {
  return (
    <article className="utility-page manual-page">
      <PageHero eyebrow={manualCopy.eyebrow} illustration="/illustrations/submit.png" supporting={manualCopy.intro} title={manualCopy.heading} tone="teal" />
      <div className="manual-steps rti-overlap-card">
        {manualCopy.steps.map((step, index) => (
          <section className="manual-step" key={step.title}>
            <div className="manual-step__copy"><FilledIcon seed={`manual:${step.title}`} /><span>{String(index + 1).padStart(2, "0")}</span><h2>{step.title}</h2><p>{step.body}</p></div>
            <div className="manual-step__image"><img alt={step.alt} height={900} loading="lazy" src={`${assetOrigin}${step.image}`} width={1440} /></div>
          </section>
        ))}
      </div>
    </article>
  );
}
