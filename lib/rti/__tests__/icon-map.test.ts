import { describe, expect, it } from "vitest";
import { iconNames } from "@/components/rti/Icon";
import {
  authorityIcons,
  checkIcons,
  conceptIcons,
  nodeIcons,
  stepIcons,
} from "../icon-map";
import { loadRtiRulePack } from "@/lib/engine/journey";
import { listAuthorities } from "@/lib/engine/authority";

const registry = new Set(iconNames);

describe("icon map", () => {
  it("gives every journey node its own icon", () => {
    const pack = loadRtiRulePack();
    for (const node of pack.nodes) {
      expect(nodeIcons[node.id], `no icon for node ${node.id}`).toBeTruthy();
      expect(registry.has(nodeIcons[node.id])).toBe(true);
    }
    const used = Object.values(nodeIcons);
    expect(new Set(used).size).toBe(used.length);
  });

  it("gives every authored check its own icon", () => {
    const pack = loadRtiRulePack();
    for (const check of pack.checks) {
      expect(checkIcons[check.id], `no icon for check ${check.id}`).toBeTruthy();
    }
    const used = Object.values(checkIcons);
    expect(new Set(used).size).toBe(used.length);
  });

  it("gives every authority its own icon", () => {
    for (const authority of listAuthorities()) {
      expect(
        authorityIcons[authority.id],
        `no icon for authority ${authority.id}`,
      ).toBeTruthy();
    }
    // The two "not identified" fallbacks are the same concept, so they share
    // a glyph deliberately. Everything else must be unique.
    const used = Object.values(authorityIcons).filter(
      (_, index) => !Object.keys(authorityIcons)[index].startsWith("unknown_"),
    );
    expect(new Set(used).size).toBe(used.length);
  });

  it("never uses one icon for two different concepts", () => {
    // Steps deliberately reuse the icon of the concept they are about, so they
    // are excluded. Everything else must be unique across the whole product.
    const withoutFallbacks = (map: Record<string, string>) =>
      Object.entries(map)
        .filter(([key]) => !key.startsWith("unknown_"))
        .map(([, value]) => value);
    const distinctConcepts = [
      ...Object.values(nodeIcons),
      ...Object.values(checkIcons),
      ...withoutFallbacks(authorityIcons),
      ...Object.values(conceptIcons),
    ];
    const seen = new Map<string, number>();
    for (const icon of distinctConcepts) {
      seen.set(icon, (seen.get(icon) ?? 0) + 1);
    }
    const duplicated = [...seen.entries()].filter(([, count]) => count > 1);
    expect(duplicated).toEqual([]);
  });

  it("only names icons that exist in the registry", () => {
    const all = [
      ...Object.values(nodeIcons),
      ...Object.values(checkIcons),
      ...Object.values(authorityIcons),
      ...Object.values(stepIcons),
      ...Object.values(conceptIcons),
    ];
    for (const name of all) {
      expect(registry.has(name), `${name} is not in the registry`).toBe(true);
    }
  });
});
