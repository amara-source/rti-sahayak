import { PageHero } from "@/components/rti/PageHero";
import { ScriptedAssistant } from "@/components/rti/ScriptedAssistant";
import { askAnswers } from "@/lib/rti/ask-answers";
import { rtiCopy } from "@/content/rti-copy";

export default function AskPage() {
  const answers = askAnswers();

  return (
    <article className="ask-page">
      <PageHero
        eyebrow={rtiCopy.ask.eyebrow}
        illustration="/illustrations/checks.png"
        supporting={rtiCopy.ask.supporting}
        title={rtiCopy.ask.heading}
        tone="violet"
      />
      <section className="ask-page__content rti-overlap-card">
        <ScriptedAssistant answers={answers} />
      </section>
    </article>
  );
}
