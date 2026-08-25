"use client";

import { useEffect, useState } from "react";

const accents = ["blue", "teal", "orange", "violet"] as const;
type Accent = (typeof accents)[number];

function applyAccent(accent: Accent, persist = true) {
  document.documentElement.dataset.accent = accent;
  if (persist) window.localStorage.setItem("rti-accent", accent);
}

export function AccentPicker() {
  const [accent, setAccent] = useState<Accent>("blue");

  useEffect(() => {
    const stored = window.localStorage.getItem("rti-accent");
    const initial = accents.includes(stored as Accent) ? (stored as Accent) : "blue";
    applyAccent(initial, false);
    const frame = window.requestAnimationFrame(() => setAccent(initial));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <div aria-label="Accent colour" className="accent-picker" role="group">
      <span>Theme</span>
      {accents.map((value) => (
        <button
          aria-label={`${value} accent`}
          aria-pressed={accent === value}
          className={`accent-picker__swatch accent-picker__swatch--${value}`}
          key={value}
          onClick={() => {
            setAccent(value);
            applyAccent(value);
          }}
          title={`${value} accent`}
          type="button"
        />
      ))}
    </div>
  );
}
