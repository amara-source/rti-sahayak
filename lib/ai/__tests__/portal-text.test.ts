import { describe, expect, it } from "vitest";
import { sanitiseForPortal, normaliseTypography } from "../portal-text";

// The portal accepts only A-Z a-z 0-9 and , . - _ ( ) / @ : & ? \ %
const allowedCharacters = /^[A-Za-z0-9,\.\-_()\/@:&?\\%\s]*$/;

describe("portal text sanitisation", () => {
  it("produces text that passes the authored charset rule", () => {
    const model =
      "Provide my father’s pension file — including the “file notings” – and ₹10 receipt…";
    const cleaned = sanitiseForPortal(model);

    expect(allowedCharacters.test(cleaned)).toBe(true);
    expect(cleaned).not.toMatch(/[‘’“”–—…₹]/);
  });

  it("keeps the words intact while removing the characters the form rejects", () => {
    expect(sanitiseForPortal("my father’s pension")).toBe("my fathers pension");
    expect(sanitiseForPortal("the “file notings”")).toBe("the file notings");
    expect(sanitiseForPortal("delayed — badly")).toBe("delayed - badly");
  });

  it("drops characters the form rejects rather than leaving them in", () => {
    const cleaned = sanitiseForPortal("status of application #4417 (pending)*");
    expect(allowedCharacters.test(cleaned)).toBe(true);
    expect(cleaned).toContain("4417");
    expect(cleaned).toContain("(pending)");
  });

  it("normalises typography in explanatory copy without stripping apostrophes", () => {
    expect(normaliseTypography("the officer’s conduct — in law")).toBe(
      "the officer's conduct - in law",
    );
  });

  it("leaves already clean text untouched", () => {
    const clean = "Provide a copy of the file notings on application 4417.";
    expect(sanitiseForPortal(clean)).toBe(clean);
  });
});

describe("the text a citizen actually writes", () => {
  it("survives the charset check after sanitising, apostrophes and all", () => {
    const written =
      "My street's water line hasn't been repaired since March, and they haven't answered my complaints.";
    const cleaned = sanitiseForPortal(written);
    // The same set the rule pack enforces.
    expect(/^[A-Za-z0-9,\.\-_()\/@:&?\\%\s]*$/.test(cleaned)).toBe(true);
    expect(cleaned).toContain("streets water line");
  });
});
