"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { haqCopy } from "@/content/haq-copy";

interface HaqComparisonProps {
  children: ReactNode;
}

export function HaqComparison({ children }: HaqComparisonProps) {
  const [view, setView] = useState<"legacy" | "personal">("personal");
  const [selected, setSelected] = useState<string[]>([]);

  function toggleCategory(label: string) {
    setSelected((current) =>
      current.includes(label)
        ? current.filter((item) => item !== label)
        : [...current, label],
    );
  }

  return (
    <>
      <div
        aria-label={haqCopy.results.comparison.label}
        className="haq-comparison-toggle"
        role="group"
      >
        <button
          aria-pressed={view === "legacy"}
          onClick={() => setView("legacy")}
          type="button"
        >
          {haqCopy.results.comparison.current}
        </button>
        <button
          aria-pressed={view === "personal"}
          onClick={() => setView("personal")}
          type="button"
        >
          {haqCopy.results.comparison.yours}
        </button>
      </div>

      {view === "personal" ? (
        <div className="haq-personal-results">{children}</div>
      ) : (
        <section className="haq-legacy-view">
          <p>{haqCopy.results.comparison.legacyEyebrow}</p>
          <strong className="haq-legacy-count">770</strong>
          <h2>{haqCopy.results.comparison.legacyHeading}</h2>
          <span>{haqCopy.results.comparison.legacyDescription}</span>
          <h3>{haqCopy.results.comparison.categoryPrompt}</h3>
          <div className="haq-legacy-categories">
            {haqCopy.results.comparison.categories.map((category) => (
              <button
                aria-pressed={selected.includes(category.label)}
                key={category.label}
                onClick={() => toggleCategory(category.label)}
                type="button"
              >
                <span>{category.label}</span>
                <strong>{category.count}</strong>
              </button>
            ))}
          </div>
          <p className="haq-legacy-selection">
            {haqCopy.results.comparison.selected(selected.length)}
          </p>
          <small>{haqCopy.results.comparison.observedNote}</small>
        </section>
      )}
    </>
  );
}
