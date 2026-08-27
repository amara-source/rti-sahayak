"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { rtiCopy as englishRti } from "@/content/rti-copy";
import { shellCopy as englishShell } from "@/content/shell-copy";
import { hi } from "@/content/i18n/hi";
import { overlay } from "./merge";
import { STORAGE_KEY, languages, type Language } from "./languages";

const dictionaries: Partial<Record<Language, { rti?: unknown; shell?: unknown }>> = { hi };

interface LanguageValue {
  language: Language;
  setLanguage: (next: Language) => void;
  rti: typeof englishRti;
  shell: typeof englishShell;
}

const LanguageContext = createContext<LanguageValue>({
  language: "en",
  setLanguage: () => {},
  rti: englishRti,
  shell: englishShell,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Language | null;
    const known = languages.find((item) => item.code === stored && item.built);
    if (!known) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage can only be read after mount. This previously ran inside requestAnimationFrame, which never fires in a hidden tab and left the page blank.
    setLanguageState(known.code);
  }, []);

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
      document.documentElement.lang = next;
    } catch {
      // A browser with storage blocked still switches for this page.
    }
  }, []);

  const value = useMemo<LanguageValue>(() => {
    const dictionary = dictionaries[language];
    return {
      language,
      setLanguage,
      // Anything the dictionary does not name falls through to English.
      rti: dictionary?.rti ? overlay(englishRti, dictionary.rti) : englishRti,
      shell: dictionary?.shell ? overlay(englishShell, dictionary.shell) : englishShell,
    };
  }, [language, setLanguage]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

/** Interface copy in the selected language, with English as the fallback. */
export function useCopy() {
  return useContext(LanguageContext);
}
