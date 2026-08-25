"use client";

import { useEffect, useState } from "react";
import { layoutCopy } from "@/content/layout-copy";

type TextSize = "small" | "medium" | "large";

const sizeOptions: readonly { label: string; value: TextSize }[] = [
  { label: "A-", value: "small" },
  { label: "A", value: "medium" },
  { label: "A+", value: "large" },
];

function applySize(size: TextSize) {
  document.documentElement.dataset.textSize = size;
  window.localStorage.setItem("rti-text-size", size);
}

export function FontSizeControls() {
  const [size, setSize] = useState<TextSize>("medium");

  useEffect(() => {
    const stored = window.localStorage.getItem("rti-text-size");
    const initial =
      stored === "small" || stored === "large" ? stored : "medium";
    applySize(initial);
    const frame = window.requestAnimationFrame(() => setSize(initial));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <div aria-label={layoutCopy.textSizeLabel} className="text-size-options" role="group">
      {sizeOptions.map((option) => (
        <button
          aria-pressed={size === option.value}
          key={option.value}
          onClick={() => {
            setSize(option.value);
            applySize(option.value);
          }}
          type="button"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
