import statesJson from "../../rules/rti/states.json";

export interface StatePortal {
  /** The state's own online RTI portal, or null where we could not verify one. */
  url: string | null;
  verifiedOn: string;
}

export interface JurisdictionList {
  states: string[];
  unionTerritories: string[];
}

/**
 * Reference data only. The jurisdiction gate uses this to name a place. Every
 * legal consequence still comes from the journey rule pack.
 */
export function listJurisdictions(): JurisdictionList {
  return {
    states: [...statesJson.states],
    unionTerritories: [...statesJson.unionTerritories],
  };
}

/**
 * The state's own online RTI portal. Null means we could not verify one, not
 * that the state has none. Never guess an address here.
 */
export function statePortal(state: string): StatePortal {
  const portals = statesJson.stateRtiPortals as Record<string, string | null>;
  return {
    url: portals[state] ?? null,
    verifiedOn: statesJson.portalsVerifiedOn,
  };
}
