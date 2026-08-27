"use client";

import { useCopy } from "@/lib/i18n/LanguageProvider";
import { FontSizeControls } from "@/components/layout/FontSizeControls";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { AccentPicker } from "@/components/layout/AccentPicker";
import { LanguagePicker } from "@/components/layout/LanguagePicker";

export function GovStrip() {
  // Interface copy in the selected language, English where untranslated.
  const { layout: layoutCopy, shell: shellCopy } = useCopy();
  return (
    <div className="utility-strip utility-strip--marketing">
      <div className="site-shell utility-strip__inner">
        <span
          aria-label={shellCopy.loggedOut.utility.accessibility}
          className="utility-access"
        >
          {shellCopy.loggedOut.utility.accessibilityLabel}
        </span>
        <div className="utility-strip__tools">
          <a className="skip-link" href="#main-content">
            {layoutCopy.skipToMain}
          </a>
          <FontSizeControls />
          <ThemeToggle />
          <AccentPicker />
          <LanguagePicker />
        </div>
      </div>
    </div>
  );
}
