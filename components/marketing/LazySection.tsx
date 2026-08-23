"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { marketingCopy } from "@/content/marketing-copy";

export function LazySection({ children }: { children: ReactNode }) {
  const marker = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = marker.current;
    if (!element) return;
    const reveal = () => setVisible(true);
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) reveal();
      },
      { rootMargin: "420px" },
    );
    observer.observe(element);
    window.addEventListener("beforeprint", reveal);
    return () => {
      observer.disconnect();
      window.removeEventListener("beforeprint", reveal);
    };
  }, []);

  return (
    <div className={visible ? "lazy-section is-visible" : "lazy-section"} ref={marker}>
      {visible ? children : (
        <div className="marketing-section-skeleton" role="status">
          <span>{marketingCopy.lazy.loading}</span>
          <i /><i /><i />
        </div>
      )}
    </div>
  );
}
