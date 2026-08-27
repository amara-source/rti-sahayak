"use client";

import { useCopy } from "@/lib/i18n/LanguageProvider";

export function MockBadge() {
  // Interface copy in the selected language, English where untranslated.
  const { tracker: trackerCopy } = useCopy();
  return <span className="mock-badge">{trackerCopy.mockBadge}</span>;
}
