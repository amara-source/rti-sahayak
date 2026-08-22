import { describe, expect, it, vi } from "vitest";
import {
  RestrictedProfileInputError,
  extractProfileText,
} from "../extract";
import type { ModelGateway, StructuredModelRequest } from "../model";

function gatewayReturning(output: unknown) {
  const generateStructured = vi.fn(async () => output);
  const gateway: ModelGateway = {
    generateStructured,
    generateText: vi.fn(),
  };

  return { gateway, generateStructured };
}

describe("extractProfileText", () => {
  it("returns only validated Profile fields from structured model output", async () => {
    const { gateway } = gatewayReturning({
      fields: [
        { field: "currentState", value: "Bihar" },
        { field: "homeState", value: "Karnataka" },
        { field: "childrenAges", value: [4, 7] },
        { field: "gender", value: "F" },
        { field: "unknownField", value: "ignore this" },
        { field: "childrenAges", value: [-1, 9, 140] },
      ],
    });

    await expect(
      extractProfileText(
        "I live in Bihar and am moving home to Karnataka with children aged 4 and 7. I am a woman.",
        gateway,
      ),
    ).resolves.toEqual({
      currentState: "Bihar",
      homeState: "Karnataka",
      childrenAges: [9],
      gender: "F",
    });
  });

  it("instructs the model to extract explicit facts without judging the user", async () => {
    const { gateway, generateStructured } = gatewayReturning({ fields: [] });

    await extractProfileText("I am moving next month.", gateway);

    const request = generateStructured.mock.calls[0]?.[0] as
      | StructuredModelRequest
      | undefined;
    expect(request?.instructions).toContain("only facts explicitly stated");
    expect(request?.instructions).toContain("Never infer sensitive attributes");
    expect(request?.instructions).toContain("Never decide eligibility");
    expect(request?.input).toBe("I am moving next month.");
    expect(JSON.stringify(request?.schema)).not.toContain("sourceUrl");
  });

  it("rejects Aadhaar-like or PAN-like identifiers before any model call", async () => {
    const { gateway, generateStructured } = gatewayReturning({ fields: [] });

    await expect(
      extractProfileText("My Aadhaar is 1234 5678 9012.", gateway),
    ).rejects.toBeInstanceOf(RestrictedProfileInputError);
    await expect(
      extractProfileText("My PAN is ABCDE1234F.", gateway),
    ).rejects.toBeInstanceOf(RestrictedProfileInputError);
    expect(generateStructured).not.toHaveBeenCalled();
  });

  it("never returns an Aadhaar field even if a model attempts to add it", async () => {
    const { gateway } = gatewayReturning({
      fields: [
        { field: "aadhaarLast4", value: "1234" },
        { field: "currentState", value: "Bihar" },
      ],
    });

    await expect(
      extractProfileText("I live in Bihar.", gateway),
    ).resolves.toEqual({ currentState: "Bihar" });
  });
});
