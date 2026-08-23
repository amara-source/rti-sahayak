"use client";

import { useEffect, useState } from "react";
import { shellCopy } from "@/content/shell-copy";

const observedVisitors = 191_575_183;

export function VisitorCounter() {
  const [count, setCount] = useState(observedVisitors);

  useEffect(() => {
    const timer = window.setInterval(() => setCount((value) => value + 1), 4_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <p className="visitor-counter">
      <span>{shellCopy.footer.visitors}</span>
      <strong>{new Intl.NumberFormat("en-IN").format(count)}</strong>
      <small>{shellCopy.footer.visitorNote}</small>
    </p>
  );
}
