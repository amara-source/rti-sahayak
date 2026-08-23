import { haqCopy } from "../../content/haq-copy";
import type { Entitlement, Profile } from "../engine/types";

interface ProfileOption {
  label: string;
  value: string;
}

const optionSets = Object.values(haqCopy.profile.options) as unknown as readonly (
  readonly ProfileOption[]
)[];

const optionLabels = new Map(
  optionSets.flatMap((options) =>
    options.map((option) => [option.value, option.label] as const),
  ),
);

function list(values: readonly string[]): string {
  if (values.length < 2) {
    return values[0] ?? "";
  }

  if (values.length === 2) {
    return `${values[0]} and ${values[1]}`;
  }

  return `${values.slice(0, -1).join(", ")}, and ${values.at(-1)}`;
}

function profileValue(value: unknown): string | null {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (Array.isArray(value)) {
    const values = value.flatMap((item) => {
      if (typeof item === "string" || typeof item === "number") {
        return [optionLabels.get(String(item)) ?? String(item)];
      }

      return [];
    });

    return values.length > 0 ? list(values) : null;
  }

  if (typeof value === "string" || typeof value === "number") {
    return optionLabels.get(String(value)) ?? String(value);
  }

  return null;
}

export function renderWhyYouMayQualify(
  entitlement: Entitlement,
  profile: Profile,
): string {
  const facts = profile as Record<string, unknown>;

  return entitlement.whyYouMayQualify.replace(
    /\{\{([A-Za-z][A-Za-z0-9]*)\}\}/g,
    (placeholder, field: string) =>
      profileValue(facts[field]) ?? placeholder,
  );
}
