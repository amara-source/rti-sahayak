import statesJson from "../../rules/rti/states.json";

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
