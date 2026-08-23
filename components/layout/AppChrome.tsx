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
    pathname === "/dashboard" ||
    pathname.startsWith("/app/") ||
    pathname.startsWith("/haq") ||
    pathname.startsWith("/language-demo") ||
    pathname.startsWith("/node/") ||
    /^\/events\/[^/]+/.test(pathname)
  );
}

export function AppChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/login") {
    return <main id="main-content" tabIndex={-1}>{children}</main>;
  }

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
