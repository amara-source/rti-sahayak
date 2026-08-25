"use client";

import { useEffect, useState } from "react";
import { shellCopy } from "@/content/shell-copy";

type Theme = "light" | "dark";

function applyTheme(theme: Theme, persist = true) {
  document.documentElement.dataset.theme = theme;
  if (persist) window.localStorage.setItem("rti-theme", theme);
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const stored = window.localStorage.getItem("rti-theme");
    const initial: Theme = stored === "dark" || stored === "light"
      ? stored
      : "light";
    applyTheme(initial, false);
    const frame = window.requestAnimationFrame(() => setTheme(initial));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const label = theme === "dark" ? shellCopy.theme.light : shellCopy.theme.dark;

  return (
    <button
      aria-label={label}
      aria-pressed={theme === "dark"}
      className="theme-toggle"
      onClick={() => {
        const next = theme === "dark" ? "light" : "dark";
        setTheme(next);
        applyTheme(next);
      }}
      title={label}
      type="button"
    >
      <svg aria-hidden="true" className="theme-toggle__icon" viewBox="0 0 24 24">
        {theme === "dark" ? (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.4 1.4M17.6 17.6 19 19M19 5l-1.4 1.4M6.4 17.6 5 19" />
          </>
        ) : <path d="M20 15.2A8.4 8.4 0 0 1 8.8 4 8.5 8.5 0 1 0 20 15.2Z" />}
      </svg>
    </button>
  );
}
