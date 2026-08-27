import type { ReactNode } from "react";
import { DisclaimerStrip } from "./DisclaimerStrip";
import { FloatingTools } from "./FloatingTools";
import { Footer } from "./Footer";
import { GovStrip } from "./GovStrip";
import { Header } from "./Header";
import { LanguageProvider } from "@/lib/i18n/LanguageProvider";

export function AppChrome({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      {/* Inside the provider, so the strip translates with everything else. */}
      <DisclaimerStrip />
      <GovStrip />
      <Header />
      <main id="main-content" tabIndex={-1}>{children}</main>
      <Footer />
      <FloatingTools />
    </LanguageProvider>
  );
}
