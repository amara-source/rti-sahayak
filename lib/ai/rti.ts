import type { ModelGateway } from "./model";
import { normaliseTypography, sanitiseForPortal } from "./portal-text";
import type { RewriteChange } from "../rti/draft";

export interface ExtractedRtiRequest {
  subject: string;
  summary: string;
}

export interface ReframedRtiRequest {
  rewritten: string;
  changes: RewriteChange[];
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function extractRtiRequest(
  text: string,
  model: ModelGateway | null,
): Promise<ExtractedRtiRequest> {
  if (!model) {
    return { subject: text, summary: text };
  }

  const result = await model.generateStructured({
    name: "rti_request_extraction",
    instructions:
      "Extract only what the citizen explicitly wrote. Do not decide jurisdiction, legal rights, deadlines, eligibility, authority or consequences. Do not infer missing facts.",
    input: text,
    maxOutputTokens: 500,
    schema: {
      type: "object",
      additionalProperties: false,
      properties: {
        subject: { type: "string" },
        summary: { type: "string" },
      },
      required: ["subject", "summary"],
    },
  });

  if (
    !isObject(result) ||
    typeof result.subject !== "string" ||
    typeof result.summary !== "string"
  ) {
    throw new Error("Invalid extraction");
  }

  return {
    subject: sanitiseForPortal(result.subject),
    summary: normaliseTypography(result.summary),
  };
}

export async function reframeRtiRequest(
  text: string,
  authority: string,
  model: ModelGateway | null,
): Promise<ReframedRtiRequest> {
  if (!model) {
    return {
      rewritten: text,
      changes: [
        {
          title: "Your wording is preserved",
          reason:
            "The rewriting service is unavailable, so nothing was changed. You can edit the filing text yourself.",
        },
      ],
    };
  }

  const result = await model.generateStructured({
    name: "rti_request_reframe",
    instructions:
      "Rewrite the citizen's text as a concise request for existing records held by the named public authority. Preserve every fact. Do not decide jurisdiction, deadlines, eligibility, exemptions, consequences or whether the citizen has a legal right. Return the rewritten request and a plain-language list of textual changes with reasons.",
    input: `Public authority: ${authority}\nCitizen text: ${text}`,
    maxOutputTokens: 1_500,
    schema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rewritten: { type: "string" },
        changes: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              title: { type: "string" },
              reason: { type: "string" },
            },
            required: ["title", "reason"],
          },
        },
      },
      required: ["rewritten", "changes"],
    },
  });

  if (
    !isObject(result) ||
    typeof result.rewritten !== "string" ||
    !Array.isArray(result.changes)
  ) {
    throw new Error("Invalid rewrite");
  }

  const changes = result.changes.flatMap((item) =>
    isObject(item) &&
    typeof item.title === "string" &&
    typeof item.reason === "string"
      ? [
          {
            title: normaliseTypography(item.title),
            reason: normaliseTypography(item.reason),
          },
        ]
      : [],
  );

  // The filing text has to survive the portal charset check, which the model
  // knows nothing about.
  return { rewritten: sanitiseForPortal(result.rewritten), changes };
}
