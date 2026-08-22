export interface DependencyNode {
  id: string;
  dependsOn: readonly string[];
}

export function topologicalSort<T extends DependencyNode>(nodes: readonly T[]): T[] {
  const byId = new Map<string, T>();

  for (const node of nodes) {
    if (byId.has(node.id)) {
      throw new Error(`Duplicate rule node id: ${node.id}`);
    }
    byId.set(node.id, node);
  }

  const state = new Map<string, "visiting" | "visited">();
  const result: T[] = [];
  const path: string[] = [];

  function visit(node: T): void {
    const currentState = state.get(node.id);

    if (currentState === "visited") {
      return;
    }

    if (currentState === "visiting") {
      const cycleStart = path.indexOf(node.id);
      const cycle = [...path.slice(cycleStart), node.id].join(" → ");
      throw new Error(`Dependency cycle detected: ${cycle}`);
    }

    state.set(node.id, "visiting");
    path.push(node.id);

    for (const dependencyId of node.dependsOn) {
      const dependency = byId.get(dependencyId);
      if (!dependency) {
        throw new Error(
          `Rule node ${node.id} depends on missing node ${dependencyId}`,
        );
      }
      visit(dependency);
    }

    path.pop();
    state.set(node.id, "visited");
    result.push(node);
  }

  for (const node of nodes) {
    visit(node);
  }

  return result;
}
