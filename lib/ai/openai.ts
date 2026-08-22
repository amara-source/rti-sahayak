import type {
  ModelGateway,
  StructuredModelRequest,
  TextModelRequest,
} from "./model";

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";
const DEFAULT_MODEL = "gpt-5.4";

interface OpenAIModelOptions {
  apiKey: string;
  model: string;
}

interface ModelEnvironment {
  OPENAI_API_KEY?: string;
  OPENAI_MODEL?: string;
}

function outputText(payload: unknown): string {
  if (typeof payload !== "object" || payload === null) {
    throw new Error("Model response is not an object");
  }

  if (
    "output_text" in payload &&
    typeof (payload as { output_text?: unknown }).output_text === "string"
  ) {
    return (payload as { output_text: string }).output_text;
  }

  if (!("output" in payload) || !Array.isArray(payload.output)) {
    throw new Error("Model response has no text output");
  }

  for (const item of payload.output) {
    if (
      typeof item !== "object" ||
      item === null ||
      !("content" in item) ||
      !Array.isArray(item.content)
    ) {
      continue;
    }

    for (const content of item.content) {
      if (
        typeof content === "object" &&
        content !== null &&
        "text" in content &&
        typeof content.text === "string"
      ) {
        return content.text;
      }
    }
  }

  throw new Error("Model response has no text output");
}

async function requestOpenAI(
  options: OpenAIModelOptions,
  request: TextModelRequest,
  format?: Record<string, unknown>,
): Promise<string> {
  const response = await fetch(OPENAI_RESPONSES_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${options.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: options.model,
      instructions: request.instructions,
      input: request.input,
      max_output_tokens: request.maxOutputTokens,
      store: false,
      ...(format ? { text: { format } } : {}),
    }),
    signal: AbortSignal.timeout(20_000),
  });

  if (!response.ok) {
    throw new Error(`Model request failed with status ${response.status}`);
  }

  return outputText((await response.json()) as unknown);
}

export function openAIModel(options: OpenAIModelOptions): ModelGateway {
  return {
    async generateStructured(request: StructuredModelRequest) {
      const text = await requestOpenAI(options, request, {
        type: "json_schema",
        name: request.name,
        strict: true,
        schema: request.schema,
      });

      return JSON.parse(text) as unknown;
    },
    async generateText(request: TextModelRequest) {
      return requestOpenAI(options, request);
    },
  };
}

export function createOpenAIModel(
  environment?: ModelEnvironment,
): ModelGateway | null {
  const source = environment ?? {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    OPENAI_MODEL: process.env.OPENAI_MODEL,
  };
  const apiKey = source.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    return null;
  }

  return openAIModel({
    apiKey,
    model: source.OPENAI_MODEL?.trim() || DEFAULT_MODEL,
  });
}
