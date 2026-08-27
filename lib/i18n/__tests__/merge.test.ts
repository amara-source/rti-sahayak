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
    // Guidance that names rti.gov.in and rtionline.gov.in is left in English
    // rather than half translated around the two site names.
    expect(merged.authority.directory).toBe(rtiCopy.authority.directory);
  });

  it("never leaves a translated string carrying a run of English words", () => {
    const merged = overlay(rtiCopy, hi.rti) as unknown;
    const offenders: string[] = [];
    // A translated string that still holds three or more English words in a
    // row is the mixed-language card this exists to prevent.
    const run = /[A-Za-z]{3,}(\s+[A-Za-z]{3,}){2,}/;
    const walk = (value: unknown, path: string) => {
      if (typeof value === "string") {
        if (/[\u0900-\u097F]/.test(value) && run.test(value)) offenders.push(path);
        return;
      }
      if (value && typeof value === "object") {
        for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
          walk(child, path ? `${path}.${key}` : key);
        }
      }
    };
    walk(merged, "");
    expect(offenders, `mixed language strings: ${offenders.join(", ")}`).toEqual([]);
  });

  it("keeps functions callable after merging", () => {
    const merged = overlay(rtiCopy, hi.rti);
    expect(typeof merged.tracker.progress).toBe("function");
    expect(merged.tracker.progress(2, 5)).toContain("2");
  });

  it("keeps the English href when a translation gives only the label", () => {
    const base = { nav: [{ label: "Home", href: "/" }, { label: "Help", href: "/faq" }] };
    const merged = overlay(base, { nav: [{ label: "मुख्य पृष्ठ" }, { label: "सहायता" }] });
    expect(merged.nav[0]).toEqual({ label: "मुख्य पृष्ठ", href: "/" });
    expect(merged.nav[1].href).toBe("/faq");
  });

  it("replaces a list outright when the translation has a different length", () => {
    const base = { items: ["one", "two", "three"] };
    const merged = overlay(base, { items: ["एक", "दो"] });
    expect(merged.items).toEqual(["एक", "दो"]);
  });

  it("leaves English untouched when there is no translation", () => {
    expect(overlay(rtiCopy, undefined)).toBe(rtiCopy);
  });
});
