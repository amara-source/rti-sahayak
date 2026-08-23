"use client";

import { useEffect, useState } from "react";
import { layoutCopy } from "@/content/layout-copy";
import type { InterfaceLanguage } from "@/content/interface-translations";

export function LangSwitch() {
  const [language, setLanguage] = useState<InterfaceLanguage>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem("umang-language");
    if (stored !== "hi" && stored !== "kn") return;
    const frame = window.requestAnimationFrame(() => setLanguage(stored));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <label className="language-switch">
      <span className="sr-only">{layoutCopy.languageLabel}</span>
      <select
        name="language"
        onChange={(event) => {
          const nextLanguage = event.target.value as InterfaceLanguage;
          setLanguage(nextLanguage);
          window.localStorage.setItem("umang-language", nextLanguage);
          window.dispatchEvent(
            new CustomEvent<InterfaceLanguage>("umang-language", {
              detail: nextLanguage,
            }),
          );
        }}
        value={language}
      >
        {layoutCopy.languages.map((language) => (
          <option key={language.value} value={language.value}>
            {language.label}
          </option>
        ))}
      </select>
    </label>
  );
}
