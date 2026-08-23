import { landingCopy } from "./landing-copy";
import { allLandingEvents } from "./landing-events";
import { serviceCatalog } from "./service-catalog";

export interface SearchItem {
  href: string;
  label: string;
  type: "Life event" | "Category" | "Service";
}

export const searchIndex: SearchItem[] = [
  ...allLandingEvents.map((event) => ({
    href: `/events/${event.eventId}`,
    label: event.label,
    type: "Life event" as const,
  })),
  ...landingCopy.categories.items.map((category) => ({
    href: `/services?category=${category.id}`,
    label: category.label,
    type: "Category" as const,
  })),
  ...serviceCatalog.map((service) => ({
    href: `/services?category=${service.categoryId}#${service.id}`,
    label: service.label,
    type: "Service" as const,
  })),
];
