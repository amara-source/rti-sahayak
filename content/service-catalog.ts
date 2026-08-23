import deathPack from "@/rules/events/death.json";
import jobLossPack from "@/rules/events/job-loss.json";
import movingStatePack from "@/rules/events/moving-state.json";
import { landingCopy } from "./landing-copy";
import { serviceCategory } from "./service-categories";

const eventPacks = [deathPack, jobLossPack, movingStatePack] as const;

const supportingServices: Record<string, readonly string[]> = {
  travel: ["Rail journey services", "Metro services", "National highway services"],
  "health-wellness": ["Vaccination services", "Government health scheme signposting"],
  "police-legal": ["Police citizen services", "Court service signposting"],
  "mera-ration": ["Ration card details", "Ration portability services"],
  transport: ["Driving licence services", "Vehicle registration services"],
  "education-skills-employment": [
    "Scholarship services",
    "Employment services",
    "Accredited institution search",
  ],
};

export interface CatalogService {
  id: string;
  label: string;
  categoryId: string;
  eventId?: string;
}

const guidedServices: CatalogService[] = eventPacks.flatMap((pack) =>
  pack.nodes.map((node) => ({
    id: node.id,
    label: node.title,
    categoryId: serviceCategory(node.id).id,
    eventId: pack.eventId,
  })),
);

const staticServices: CatalogService[] = landingCopy.categories.items.flatMap(
  (category) =>
    (supportingServices[category.id] ?? []).map((label, index) => ({
      id: `${category.id}-${index + 1}`,
      label,
      categoryId: category.id,
    })),
);

export const serviceCatalog = [...guidedServices, ...staticServices].filter(
  (service, index, services) =>
    services.findIndex(
      (candidate) =>
        candidate.categoryId === service.categoryId &&
        candidate.label === service.label,
    ) === index,
);
