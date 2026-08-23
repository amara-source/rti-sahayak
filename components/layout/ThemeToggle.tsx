"use client";

import { useEffect, useState } from "react";
import { shellCopy } from "@/content/shell-copy";

type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  window.localStorage.setItem("umang-theme", theme);
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const stored = window.localStorage.getItem("umang-theme");
    const initial = stored === "dark" ? "dark" : "light";
    applyTheme(initial);
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
      <span aria-hidden="true">◐</span>
    </button>
  );
}
