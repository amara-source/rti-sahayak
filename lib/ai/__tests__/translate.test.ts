import { describe, expect, it, vi } from "vitest";
import {
  UnsupportedTranslationError,
  translateText,
} from "../translate";
import type { ModelGateway, TextModelRequest } from "../model";

function translationGateway(result = "ಮುಂದಿನ ತಿಂಗಳು") {
  const generateText = vi.fn(async () => result);
  const gateway: ModelGateway = {
    generateStructured: vi.fn(),
    generateText,
  };

  return { gateway, generateText };
}

describe("translateText", () => {
  it("uses the model only for faithful Hindi-to-Kannada translation", async () => {
    const { gateway, generateText } = translationGateway();

    await expect(
      translateText("अगले महीने", "hi", "kn", gateway),
    ).resolves.toBe("ಮುಂದಿನ ತಿಂಗಳು");

    const request = (
      generateText.mock.calls as unknown as [[TextModelRequest]]
    )[0]?.[0];
    expect(request?.instructions).toContain("Translate from Hindi to Kannada");
    expect(request?.instructions).toContain("Do not decide eligibility");
    expect(request?.instructions).toContain("Preserve ASCII field markers");
    expect(request?.input).toBe("अगले महीने");
  });

  it("rejects unverified language paths without calling the model", async () => {
    const { gateway, generateText } = translationGateway();

    await expect(
      translateText("हम जा रहल बानी", "bho", "kn", gateway),
    ).rejects.toBeInstanceOf(UnsupportedTranslationError);
    await expect(
      translateText("अगले महीने", "hi", "en", gateway),
    ).rejects.toBeInstanceOf(UnsupportedTranslationError);
    expect(generateText).not.toHaveBeenCalled();
  });
});
