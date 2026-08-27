import { describe, expect, it } from "vitest";
import { overlay } from "../merge";
import { hi } from "@/content/i18n/hi";
import { rtiCopy } from "@/content/rti-copy";

describe("translation overlay", () => {
  it("replaces only what the translation names", () => {
    const merged = overlay(rtiCopy, hi.rti);
    expect(merged.common.back).toBe("वापस जाएँ");
  });

  it("never drops a key that English has", () => {
    const merged = overlay(rtiCopy, hi.rti) as Record<string, unknown>;
    for (const key of Object.keys(rtiCopy)) {
      expect(merged[key], `${key} disappeared after translation`).toBeDefined();
    }
  });

  it("falls through to English for anything untranslated", () => {
    const merged = overlay(rtiCopy, hi.rti);
    // The Act guide is deliberately not translated.
    expect(merged.checks.attachment).toBe(rtiCopy.checks.attachment);
  });

  it("keeps functions callable after merging", () => {
    const merged = overlay(rtiCopy, hi.rti);
    expect(typeof merged.tracker.progress).toBe("function");
    expect(merged.tracker.progress(2, 5)).toContain("2");
  });

  it("leaves English untouched when there is no translation", () => {
    expect(overlay(rtiCopy, undefined)).toBe(rtiCopy);
  });
});
