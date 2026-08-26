import type { ReactNode } from "react";
import { FloatingTools } from "./FloatingTools";
import { Footer } from "./Footer";
import { GovStrip } from "./GovStrip";
import { Header } from "./Header";

export function AppChrome({ children }: { children: ReactNode }) {
  return (
    <>
      <GovStrip />
      <Header />
      <main id="main-content" tabIndex={-1}>{children}</main>
      <Footer />
      <FloatingTools />
    </>
  );
}
