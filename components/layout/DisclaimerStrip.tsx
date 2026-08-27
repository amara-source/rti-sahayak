"use client";

import { useCopy } from "@/lib/i18n/LanguageProvider";

export function DisclaimerStrip() {
  // Interface copy in the selected language, English where untranslated.
  const { layout: layoutCopy } = useCopy();
  return (
    <div className="disclaimer-strip">
      <div className="site-shell">{layoutCopy.disclaimer}</div>
    </div>
  );
}
