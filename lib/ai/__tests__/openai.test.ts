import { afterEach, describe, expect, it, vi } from "vitest";
import { createOpenAIModel, openAIModel } from "../openai";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("OpenAI model gateway", () => {
  it("stays unavailable when no server API key exists", () => {
    expect(createOpenAIModel({})).toBeNull();
  });

  it("sends a non-stored server request and parses output text", async () => {
    const fetchMock = vi.fn(async () =>
      new Response(
        JSON.stringify({
          output: [
            {
              type: "message",
              content: [{ type: "output_text", text: "ಕನ್ನಡ ಪಠ್ಯ" }],
            },
          ],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    );
    vi.stubGlobal("fetch", fetchMock);
    const gateway = openAIModel({ apiKey: "server-secret", model: "gpt-test" });

    await expect(
      gateway.generateText({
        instructions: "Translate only.",
        input: "हिंदी पाठ",
        maxOutputTokens: 200,
      }),
    ).resolves.toBe("ಕನ್ನಡ ಪಠ್ಯ");

    const [, init] = fetchMock.mock.calls[0] ?? [];
    const body = JSON.parse(String(init?.body)) as Record<string, unknown>;
    expect(init?.headers).toMatchObject({
      Authorization: "Bearer server-secret",
    });
    expect(body).toMatchObject({ model: "gpt-test", store: false });
  });
});
