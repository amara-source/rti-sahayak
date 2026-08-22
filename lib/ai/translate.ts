import type { ModelGateway } from "./model";

const TRANSLATION_INSTRUCTIONS = `Translate from Hindi to Kannada faithfully.
Return only the translated text. Preserve line breaks and numbers.
Preserve ASCII field markers in square brackets exactly.
Do not decide eligibility, recommend a service, assign a task, set a deadline, order work, or interpret a legal consequence.
Do not add, remove, summarise, or explain information.`;

export class UnsupportedTranslationError extends Error {}

export async function translateText(
  text: string,
  from: string,
  to: string,
  model: ModelGateway,
): Promise<string> {
  if (from !== "hi" || to !== "kn") {
    throw new UnsupportedTranslationError(
      "Only verified Hindi-to-Kannada translation is available",
    );
  }

  return model.generateText({
    instructions: TRANSLATION_INSTRUCTIONS,
    input: text,
    maxOutputTokens: 900,
  });
}
