import deathPack from "@/rules/events/death.json";
import jobLossPack from "@/rules/events/job-loss.json";
import movingStatePack from "@/rules/events/moving-state.json";
import tierTwoManifest from "@/rules/events/_tier2/manifest.json";

export interface LandingEvent {
  cluster: string;
  eventId: string;
  label: string;
  description?: string;
  tier: 1 | 2;
}

interface ClusterBlueprint {
  name: string;
  icon: LandingIconName;
  tierOne?: {
    pack: { eventId: string; label: string };
    insertionIndex: number;
  };
}

export type LandingIconName =
  | "place"
  | "family"
  | "work"
  | "money"
  | "education"
  | "health"
  | "identity"
  | "travel"
  | "legal"
  | "ration"
  | "transport"
  | "crisis"
  | "ageing"
  | "farmers"
  | "pensioners"
  | "learning"
  | "familyCare"
  | "youth"
  | "bank"
  | "district"
  | "grievance"
  | "utility"
  | "general";

const clusterBlueprints: readonly ClusterBlueprint[] = [
  {
    name: "Place",
    icon: "place",
    tierOne: { pack: movingStatePack, insertionIndex: 0 },
  },
  {
    name: "Family",
    icon: "family",
    tierOne: { pack: deathPack, insertionIndex: 0 },
  },
  {
    name: "Work",
    icon: "work",
    tierOne: { pack: jobLossPack, insertionIndex: 2 },
  },
  { name: "Money and crisis", icon: "crisis" },
  { name: "Education", icon: "education" },
  { name: "Health and ageing", icon: "ageing" },
  { name: "Identity", icon: "identity" },
];

export const lifeEventClusters = clusterBlueprints.map((cluster) => {
  const events: LandingEvent[] = tierTwoManifest
    .filter((event) => event.cluster === cluster.name)
    .map((event) => ({ ...event, tier: 2 as const }));

  if (cluster.tierOne) {
    const { pack, insertionIndex } = cluster.tierOne;
    events.splice(insertionIndex, 0, {
      cluster: cluster.name,
      eventId: pack.eventId,
      label: pack.label,
      tier: 1,
    });
  }

  return { name: cluster.name, icon: cluster.icon, events };
});

export const allLandingEvents = lifeEventClusters.flatMap(
  (cluster) => cluster.events,
);
