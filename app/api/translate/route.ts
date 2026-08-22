import { NextResponse } from "next/server";
import { modelCopy } from "@/content/model-copy";
import { createOpenAIModel } from "@/lib/ai/openai";
import {
  UnsupportedTranslationError,
  translateText,
} from "@/lib/ai/translate";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: modelCopy.api.invalid }, { status: 400 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("text" in body) ||
    !("from" in body) ||
    !("to" in body) ||
    typeof body.text !== "string" ||
    typeof body.from !== "string" ||
    typeof body.to !== "string" ||
    body.text.trim().length < 1 ||
    body.text.length > 2_000
  ) {
    return NextResponse.json({ error: modelCopy.api.invalid }, { status: 400 });
  }

  if (body.from !== "hi" || body.to !== "kn") {
    return NextResponse.json(
      { error: modelCopy.api.unsupported },
      { status: 400 },
    );
  }

  const model = createOpenAIModel();
  if (!model) {
    return NextResponse.json(
      { error: modelCopy.api.unavailable, code: "MODEL_UNAVAILABLE" },
      { status: 503 },
    );
  }

  try {
    const text = await translateText(body.text, body.from, body.to, model);
    return NextResponse.json({ text });
  } catch (error) {
    if (error instanceof UnsupportedTranslationError) {
      return NextResponse.json(
        { error: modelCopy.api.unsupported },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: modelCopy.api.unavailable, code: "MODEL_UNAVAILABLE" },
      { status: 503 },
    );
  }
}
