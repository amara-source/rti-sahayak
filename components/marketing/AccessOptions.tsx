"use client";

import { useState } from "react";
import { marketingCopy } from "@/content/marketing-copy";

export function AccessOptions() {
  const [notice, setNotice] = useState<string | null>(null);

  return (
    <div className="access-options">
      <div>
        {marketingCopy.access.options.map((option) => (
          <button onClick={() => setNotice(marketingCopy.access.selected(option))} type="button" key={option}>{option}</button>
        ))}
      </div>
      {notice ? <p role="status">{notice}</p> : null}
    </div>
  );
}
