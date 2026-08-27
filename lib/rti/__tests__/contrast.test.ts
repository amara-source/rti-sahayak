import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

/**
 * The appeal clock rendered white text on a white ground for four review
 * rounds. Every check that looked at the DOM passed, because the numbers were
 * correct; they were simply invisible. This guards the shape of that bug:
 * a rule must never set a light background on a surface whose text is white
 * without also restating the colour.
 */
const css = readFileSync(
  new URL("../../../app/globals.css", import.meta.url),
  "utf8",
);

function rulesFor(selector: string): string[] {
  const bodies: string[] = [];
  const pattern = /([^{}]+)\{([^{}]*)\}/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(css))) {
    if (match[1].split(",").some((part) => part.trim() === selector)) {
      bodies.push(match[2]);
    }
  }
  return bodies;
}

const lightBackgrounds = /background:\s*(var\(--surface\)|#fff|#ffffff|white)/;

describe("clock surfaces stay readable", () => {
  it("never gives the appeal clock a light ground without restating the text colour", () => {
    for (const body of rulesFor(".rti-appeal-clock")) {
      if (lightBackgrounds.test(body)) {
        expect(
          /color:\s*(?!white|#fff)/.test(body),
          `a rule sets a light background on .rti-appeal-clock without a dark text colour: ${body.trim()}`,
        ).toBe(true);
      }
    }
  });

  it("ends with the appeal clock on its dark ground", () => {
    const bodies = rulesFor(".rti-appeal-clock");
    const last = bodies.filter((b) => /background:/.test(b)).at(-1) ?? "";
    expect(last).toMatch(/accent-deep/);
  });

  it("keeps the same guarantee for the case clock", () => {
    const bodies = rulesFor(".rti-clock");
    const last = bodies.filter((b) => /background:/.test(b)).at(-1) ?? "";
    expect(last).not.toMatch(/var\(--surface\)|#fff|white/);
  });
});
