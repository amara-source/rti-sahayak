"use client";

import type { ReactNode } from "react";
import { useCopy } from "@/lib/i18n/LanguageProvider";
import { UtilityPage } from "./UtilityPage";

/**
 * The home page's outer shell.
 *
 * It exists only so the page copy is read through the language context. The
 * page itself stays a server component.
 */
export function HomePageShell({ children, hero }: { children: ReactNode; hero: ReactNode }) {
  // Interface copy in the selected language, English where untranslated.
  const { pages } = useCopy();
  return (
    <UtilityPage copy={pages.home} hero={hero}>
      {children}
    </UtilityPage>
  );
}
