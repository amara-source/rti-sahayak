"use client";

import { useCopy } from "@/lib/i18n/LanguageProvider";
import { languages } from "@/lib/i18n/languages";

/**
 * Real language switching for the interface. A language that has not been
 * translated yet is listed and disabled with the reason, rather than hidden or
 * offered and then falling back silently.
 */
export function LanguagePicker() {
  const { language, setLanguage } = useCopy();

  return (
    <div aria-label="Language" className="language-picker" role="group">
      {languages.map((item) => (
        <button
          aria-pressed={language === item.code}
          className={language === item.code ? "is-selected" : undefined}
          disabled={!item.built}
          key={item.code}
          lang={item.code}
          onClick={() => setLanguage(item.code)}
          title={item.built ? undefined : "Not translated yet"}
          type="button"
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
