import type { Profile } from "../engine/types";
import type { ModelGateway } from "./model";

const PROFILE_EXTRACTION_SCHEMA = {
  type: "object",
  properties: {
    fields: {
      type: "array",
      items: {
        type: "object",
        properties: {
          field: {
            type: "string",
            enum: [
              "name",
              "dob",
              "gender",
              "currentState",
              "currentDistrict",
              "homeState",
              "homeDistrict",
              "incomeBand",
              "employment",
              "marital",
              "isSingleParent",
              "childrenAges",
              "parentsAges",
              "category",
              "hasDisability",
              "housing",
            ],
          },
          value: {
            anyOf: [
              { type: "string" },
              { type: "boolean" },
              { type: "null" },
              { type: "array", items: { type: "number" } },
            ],
          },
        },
        required: ["field", "value"],
        additionalProperties: false,
      },
    },
  },
  required: ["fields"],
  additionalProperties: false,
} satisfies Record<string, unknown>;

const EXTRACTION_INSTRUCTIONS = `Read the user's description and extract only facts explicitly stated by the user into the supplied profile fields.
Never infer sensitive attributes: gender, category, disability, or income. Include one only when the user explicitly declares it.
Never decide eligibility, recommend a service, assign a task, set a deadline, order work, or interpret a legal consequence.
Never output Aadhaar, PAN, OTP, password, payment, or other identifier data.
Use ISO YYYY-MM-DD for dob. Use number arrays for childrenAges and parentsAges.
Use these canonical values where explicitly stated: gender M, F, O, or NA; incomeBand <1L, 1-3L, 3-5L, 5-8L, 8L+, or NA; employment salaried, gig, self, unorganised, student, or none; marital single, married, widowed, separated, or NA; category general, obc, sc, st, ews, or NA; housing own, rent-registered, rent-stamp, employer, or family.
If a detail is absent or uncertain, omit it. Return structured fields only.`;

type ExtractableField = Exclude<keyof Profile, "aadhaarLast4">;

const stringFields = new Set<ExtractableField>([
  "name",
  "dob",
  "currentState",
  "currentDistrict",
  "homeState",
  "homeDistrict",
]);

const enumValues = {
  gender: new Set(["M", "F", "O", "NA"]),
  incomeBand: new Set(["<1L", "1-3L", "3-5L", "5-8L", "8L+", "NA"]),
  employment: new Set([
    "salaried",
    "gig",
    "self",
    "unorganised",
    "student",
    "none",
  ]),
  marital: new Set(["single", "married", "widowed", "separated", "NA"]),
  category: new Set(["general", "obc", "sc", "st", "ews", "NA"]),
  housing: new Set([
    "own",
    "rent-registered",
    "rent-stamp",
    "employer",
    "family",
  ]),
} as const;

const extractableFields = new Set<ExtractableField>([
  ...stringFields,
  "gender",
  "incomeBand",
  "employment",
  "marital",
  "isSingleParent",
  "childrenAges",
  "parentsAges",
  "category",
  "hasDisability",
  "housing",
]);

interface ExtractedField {
  field: string;
  value: unknown;
}

interface ExtractionOutput {
  fields: ExtractedField[];
}

export class RestrictedProfileInputError extends Error {}

function containsRestrictedIdentifier(text: string): boolean {
  const aadhaarLike = /\b(?:\d[\s-]?){11}\d\b/;
  const panLike = /\b[A-Z]{5}\d{4}[A-Z]\b/i;
  return aadhaarLike.test(text) || panLike.test(text);
}

function validAgeArray(value: unknown): number[] | null {
  if (!Array.isArray(value)) return null;
  const ages = value.filter(
    (age): age is number =>
      typeof age === "number" &&
      Number.isInteger(age) &&
      age >= 0 &&
      age <= 120,
  );
  return ages.length > 0 ? ages : [];
}

function sanitiseExtraction(output: unknown): Partial<Profile> {
  if (
    typeof output !== "object" ||
    output === null ||
    !("fields" in output) ||
    !Array.isArray((output as ExtractionOutput).fields)
  ) {
    return {};
  }

  const profile: Record<string, unknown> = {};
  for (const candidate of (output as ExtractionOutput).fields) {
    if (
      typeof candidate !== "object" ||
      candidate === null ||
      typeof candidate.field !== "string" ||
      !extractableFields.has(candidate.field as ExtractableField)
    ) {
      continue;
    }

    const field = candidate.field as ExtractableField;
    const value = candidate.value;

    if (stringFields.has(field) && typeof value === "string" && value.trim()) {
      if (field !== "dob" || /^\d{4}-\d{2}-\d{2}$/.test(value)) {
        profile[field] = value.trim();
      }
      continue;
    }

    if (field === "childrenAges" || field === "parentsAges") {
      const ages = validAgeArray(value);
      if (ages) profile[field] = ages;
      continue;
    }

    if (field === "isSingleParent" && typeof value === "boolean") {
      profile[field] = value;
      continue;
    }

    if (
      field === "hasDisability" &&
      (typeof value === "boolean" || value === null)
    ) {
      profile[field] = value;
      continue;
    }

    if (
      field in enumValues &&
      typeof value === "string" &&
      enumValues[field as keyof typeof enumValues].has(value as never)
    ) {
      profile[field] = value;
    }
  }

  return profile as Partial<Profile>;
}

export async function extractProfileText(
  freeText: string,
  model: ModelGateway,
): Promise<Partial<Profile>> {
  if (containsRestrictedIdentifier(freeText)) {
    throw new RestrictedProfileInputError(
      "Government identifiers cannot be sent to the model",
    );
  }

  const output = await model.generateStructured({
    instructions: EXTRACTION_INSTRUCTIONS,
    input: freeText,
    maxOutputTokens: 900,
    name: "profile_extraction",
    schema: PROFILE_EXTRACTION_SCHEMA,
  });

  return sanitiseExtraction(output);
}
