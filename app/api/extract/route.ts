import { NextResponse } from "next/server";
import { rtiCopy } from "@/content/rti-copy";
import { createOpenAIModel } from "@/lib/ai/openai";
import { extractRtiRequest } from "@/lib/ai/rti";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: rtiCopy.api.invalid }, { status: 400 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("text" in body) ||
    typeof body.text !== "string" ||
    !body.text.trim()
  ) {
    return NextResponse.json({ error: rtiCopy.api.invalid }, { status: 400 });
  }

  const text = body.text.trim();
  try {
    const extracted = await extractRtiRequest(text, createOpenAIModel());
    return NextResponse.json({ extracted, degraded: false });
  } catch {
    return NextResponse.json({
      extracted: { subject: text, summary: text },
      degraded: true,
    });
  }
}
