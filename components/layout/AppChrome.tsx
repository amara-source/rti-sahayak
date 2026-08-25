"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { LoggedInShell } from "@/components/application/LoggedInShell";
import { FloatingTools } from "./FloatingTools";
import { Footer } from "./Footer";
import { GovStrip } from "./GovStrip";
import { Header } from "./Header";

function usesApplicationShell(pathname: string): boolean {
  return (
    pathname === "/case" ||
    pathname.startsWith("/case/") ||
    pathname.startsWith("/appeal/") ||
    pathname === "/complaint"
  );
}

export function AppChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (usesApplicationShell(pathname)) {
    return <LoggedInShell>{children}</LoggedInShell>;
  }

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
