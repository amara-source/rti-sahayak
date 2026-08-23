"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FontSizeControls } from "@/components/layout/FontSizeControls";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { searchIndex } from "@/content/search-index";
import { shellCopy } from "@/content/shell-copy";

type Persona = (typeof shellCopy.personas)[number];

function storedPersona(): Persona {
  if (typeof window === "undefined") return shellCopy.personas[0];
  const id = window.localStorage.getItem("umang-demo-persona");
  return shellCopy.personas.find((persona) => persona.id === id) ?? shellCopy.personas[0];
}

export function LoggedInShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [query, setQuery] = useState("");
  const [utility, setUtility] = useState<"accessibility" | "notifications" | "isl" | "account" | null>(null);
  const [persona, setPersona] = useState<Persona>(shellCopy.personas[0]);

  useEffect(() => {
    const timer = window.setInterval(
      () => setPlaceholderIndex((index) => (index + 1) % shellCopy.loggedIn.searchNames.length),
      2_800,
    );
    const frame = window.requestAnimationFrame(() => setPersona(storedPersona()));
    return () => {
      window.clearInterval(timer);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  const matches = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];
    return searchIndex
      .filter((item) => item.label.toLowerCase().includes(normalized))
      .slice(0, 5);
  }, [query]);

  const navItems = [
    ...shellCopy.loggedIn.nav.slice(0, 3),
    { label: persona.state, href: `/app/services?state=${persona.state.toLowerCase()}` },
    ...shellCopy.loggedIn.nav.slice(3),
  ];

  return (
    <div className="application-shell">
      <header className="application-header">
        <button
          aria-expanded={sidebarOpen}
          aria-label={shellCopy.loggedIn.menu}
          className="application-icon-button"
          onClick={() => setSidebarOpen((open) => !open)}
          type="button"
        >
          <span aria-hidden="true">☰</span>
        </button>
        <Link className="application-brand" href="/dashboard">
          <span className="application-brand__mark" aria-hidden="true">U</span>
          <strong>UMANG</strong>
        </Link>
        <div className="application-search">
          <label className="sr-only" htmlFor="application-search">
            {shellCopy.loggedIn.searchLabel}
          </label>
          <input
            id="application-search"
            onChange={(event) => setQuery(event.target.value)}
            placeholder={`${shellCopy.loggedIn.searchLabel} “${shellCopy.loggedIn.searchNames[placeholderIndex]}”`}
            type="search"
            value={query}
          />
          {matches.length > 0 ? (
            <ul>
              {matches.map((item) => (
                <li key={`${item.type}-${item.href}`}>
                  <Link href={item.href} onClick={() => setQuery("")}>{item.label}</Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <div className="application-header__actions">
          <button className="app-text-button" onClick={() => setUtility(utility === "isl" ? null : "isl")} type="button">
            {shellCopy.loggedIn.isl}
          </button>
          <button aria-label={shellCopy.loggedIn.accessibility} className="application-icon-button" onClick={() => setUtility(utility === "accessibility" ? null : "accessibility")} type="button">
            <span aria-hidden="true">Aa</span>
          </button>
          <button aria-label={shellCopy.loggedIn.notifications} className="application-icon-button" onClick={() => setUtility(utility === "notifications" ? null : "notifications")} type="button">
            <span aria-hidden="true">●</span>
          </button>
          <ThemeToggle />
          <button aria-label={shellCopy.loggedIn.account} className="persona-button" onClick={() => setUtility(utility === "account" ? null : "account")} type="button">
            <span>{persona.initials}</span>
            <strong>{persona.name}</strong>
            <span aria-hidden="true">⌄</span>
          </button>
        </div>
        {utility ? (
          <div className={`application-utility-popover application-utility-popover--${utility}`}>
            {utility === "accessibility" ? <FontSizeControls /> : null}
            {utility === "notifications" ? <p>{shellCopy.loggedIn.notificationEmpty}</p> : null}
            {utility === "isl" ? <p>{shellCopy.loggedIn.islUnavailable}</p> : null}
            {utility === "account" ? <Link href="/login">{shellCopy.loggedIn.changeProfile}</Link> : null}
          </div>
        ) : null}
      </header>

      <aside className={`application-sidebar${sidebarOpen ? " is-open" : ""}`}>
        <nav aria-label="Application navigation">
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link className={active ? "is-active" : ""} href={item.href} key={`${item.label}-${item.href}`}>
                <span className="application-nav-icon" aria-hidden="true">{item.label.slice(0, 1)}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="application-main" id="main-content" tabIndex={-1}>{children}</main>
    </div>
  );
}
