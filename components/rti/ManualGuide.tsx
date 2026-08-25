import { manualCopy } from "@/content/utility-copy";
import { PageHero } from "./PageHero";
import { Icon } from "./Icon";
import { stepIcons } from "@/lib/rti/icon-map";


export function ManualGuide() {
  return (
    <article className="utility-page manual-page">
      <PageHero eyebrow={manualCopy.eyebrow} illustration="/illustrations/submit.png" supporting={manualCopy.intro} title={manualCopy.heading} tone="teal" />
      <div className="manual-steps rti-overlap-card">
        {manualCopy.steps.map((step, index) => (
          <section className="manual-step" key={step.title}>
            <div className="manual-step__copy"><span className="rti-icon-tile rti-icon-tile--sm"><Icon name={stepIcons[step.icon] ?? "book"} /></span><span>{String(index + 1).padStart(2, "0")}</span><h2>{step.title}</h2><p>{step.body}</p></div>
            <div className="manual-step__image"><img alt={step.alt} height={900} loading="lazy" src={step.image} width={1440} /></div>
          </section>
        ))}
      </div>
    </article>
  );
}
