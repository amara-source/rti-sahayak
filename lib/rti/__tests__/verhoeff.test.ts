import { describe, expect, it } from "vitest";
import {
  digitsOnly,
  passesVerhoeff,
  synthesiseInvalidAadhaar,
} from "../verhoeff";

describe("Verhoeff checksum", () => {
  it("recognises a checksum-valid number so it can be refused", () => {
    // Constructed here purely to prove the guard fires. Not anyone's Aadhaar.
    // 234123412346 is the documented Verhoeff example used in UIDAI's own spec.
    expect(passesVerhoeff("234123412346")).toBe(true);
  });

  it("rejects a number whose check digit is wrong", () => {
    expect(passesVerhoeff("234123412345")).toBe(false);
  });

  it("never generates a number that would pass the checksum", () => {
    for (let seed = 0; seed < 500; seed += 1) {
      const generated = synthesiseInvalidAadhaar(seed);
      expect(generated).toHaveLength(12);
      expect(/^\d{12}$/.test(generated)).toBe(true);
      expect(passesVerhoeff(generated)).toBe(false);
    }
  });

  it("strips formatting before checking", () => {
    expect(digitsOnly("2341 2341 2346")).toBe("234123412346");
    expect(passesVerhoeff("2341 2341 2346")).toBe(true);
  });
});
