import { NextResponse } from "next/server";
import { rtiCopy } from "@/content/rti-copy";
import { createOpenAIModel } from "@/lib/ai/openai";
import { reframeRtiRequest } from "@/lib/ai/rti";

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
    !("authority" in body) ||
    typeof body.text !== "string" ||
    typeof body.authority !== "string" ||
    !body.text.trim() ||
    !body.authority.trim()
  ) {
    return NextResponse.json({ error: rtiCopy.api.invalid }, { status: 400 });
  }

  const text = body.text.trim();
  try {
    const result = await reframeRtiRequest(
      text,
      body.authority.trim(),
      createOpenAIModel(),
    );
    return NextResponse.json({ ...result, degraded: false });
  } catch {
    return NextResponse.json({
      rewritten: text,
      changes: [
        {
          title: rtiCopy.draft.fallbackTitle,
          reason: rtiCopy.draft.fallbackReason,
        },
      ],
      degraded: true,
    });
  }
}
