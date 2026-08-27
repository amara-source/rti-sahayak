import { loadRtiRulePack } from "@/lib/engine/journey";
import type { ScriptedAnswer } from "@/components/rti/ScriptedAssistant";

/**
 * The scripted assistant's answers, read verbatim from the rule pack.
 *
 * Shared by the floating panel and the /ask page so there is one list, and so
 * no answer can drift from the node it comes from. Nothing here calls a model.
 */
const questions = [
  { id: "draft_request", question: "What counts as information under RTI?" },
  { id: "identify_authority", question: "What if I choose the wrong authority?" },
  { id: "await_reply", question: "How long do they have to reply?" },
  { id: "deemed_refusal", question: "What if nobody replies?" },
  { id: "first_appeal", question: "What is a First Appeal?" },
  { id: "second_appeal", question: "When can I file a Second Appeal?" },
  { id: "section_18_complaint", question: "What is a Section 18 complaint?" },
] as const;

export function askAnswers(): ScriptedAnswer[] {
  const pack = loadRtiRulePack();
  return questions.flatMap(({ id, question }) => {
    const node = pack.nodes.find((candidate) => candidate.id === id);
    return node
      ? [{
          id,
          question,
          answer: node.body,
          sourceLabel: node.sourceLabel,
          sourceUrl: node.sourceUrl,
        }]
      : [];
  });
}
