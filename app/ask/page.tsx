import { PageHero } from "@/components/rti/PageHero";
import { ScriptedAssistant } from "@/components/rti/ScriptedAssistant";
import { loadRtiRulePack } from "@/lib/engine/journey";
import { rtiCopy } from "@/content/rti-copy";

const questions = [
  { id: "draft_request", question: "What counts as information under RTI?" },
  { id: "identify_authority", question: "What if I choose the wrong authority?" },
  { id: "await_reply", question: "How long do they have to reply?" },
  { id: "deemed_refusal", question: "What if nobody replies?" },
  { id: "first_appeal", question: "What is a First Appeal?" },
  { id: "second_appeal", question: "When can I file a Second Appeal?" },
  { id: "section_18_complaint", question: "What is a Section 18 complaint?" },
] as const;

export default function AskPage() {
  const pack = loadRtiRulePack();
  const answers = questions.flatMap(({ id, question }) => {
    const node = pack.nodes.find((candidate) => candidate.id === id);
    return node ? [{ id, question, answer: node.body, sourceLabel: node.sourceLabel, sourceUrl: node.sourceUrl }] : [];
  });

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
