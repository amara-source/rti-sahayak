import { NextResponse } from "next/server";
import { modelCopy } from "@/content/model-copy";
import {
  RestrictedProfileInputError,
  extractProfileText,
} from "@/lib/ai/extract";
import { createOpenAIModel } from "@/lib/ai/openai";

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
    !("freeText" in body) ||
    typeof body.freeText !== "string" ||
    body.freeText.trim().length < 2 ||
    body.freeText.length > 2_000
  ) {
    return NextResponse.json({ error: modelCopy.api.invalid }, { status: 400 });
  }

  const model = createOpenAIModel();
  if (!model) {
    return NextResponse.json(
      { error: modelCopy.api.unavailable, code: "MODEL_UNAVAILABLE" },
      { status: 503 },
    );
  }

  try {
    return NextResponse.json(
      await extractProfileText(body.freeText.trim(), model),
    );
  } catch (error) {
    if (error instanceof RestrictedProfileInputError) {
      return NextResponse.json(
        { error: modelCopy.api.restricted, code: "RESTRICTED_IDENTIFIER" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: modelCopy.api.unavailable, code: "MODEL_UNAVAILABLE" },
      { status: 503 },
    );
  }
}
