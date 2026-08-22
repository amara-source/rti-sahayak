import type { EventRulePack, IntakeQuestion } from "./types";

export function drivenIntakeQuestions(
  pack: EventRulePack,
): IntakeQuestion[] {
  const referencedFields = new Set<string>();

  for (const node of pack.nodes) {
    for (const condition of node.appliesIf) {
      referencedFields.add(condition.field);
    }

    for (const warning of node.warnings) {
      for (const condition of warning.showIf ?? []) {
        referencedFields.add(condition.field);
      }
    }
  }

  return pack.intake.filter((question) => referencedFields.has(question.k));
}
