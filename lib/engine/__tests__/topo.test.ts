import { describe, expect, it } from "vitest";
import cyclePack from "./fixtures/cycle-pack.json";
import { topologicalSort } from "../topo";

describe("topologicalSort", () => {
  it("orders every dependency before the node that needs it", () => {
    const nodes = [
      { id: "claim", dependsOn: ["certificate"] },
      { id: "register", dependsOn: [] },
      { id: "certificate", dependsOn: ["register"] },
    ];

    expect(topologicalSort(nodes).map((node) => node.id)).toEqual([
      "register",
      "certificate",
      "claim",
    ]);
  });

  it("throws for the deliberately malformed cycle fixture", () => {
    expect(() => topologicalSort(cyclePack.nodes)).toThrow(/cycle/i);
  });
});
