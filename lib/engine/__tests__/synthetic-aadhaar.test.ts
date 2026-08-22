import { describe, expect, it } from "vitest";
import {
  generateSyntheticAadhaar,
  isVerhoeffValid,
} from "../synthetic-aadhaar";

describe("synthetic Aadhaar generation", () => {
  it("recognises a non-Aadhaar Verhoeff example", () => {
    expect(isVerhoeffValid("2363")).toBe(true);
    expect(isVerhoeffValid("2364")).toBe(false);
  });

  it("never generates a number that passes Verhoeff", () => {
    const generated = Array.from({ length: 512 }, (_, index) =>
      generateSyntheticAadhaar(index),
    );

    expect(generated.every((value) => /^\d{12}$/.test(value))).toBe(true);
    expect(generated.every((value) => !isVerhoeffValid(value))).toBe(true);
  });
});
