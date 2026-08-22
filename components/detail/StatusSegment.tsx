"use client";

import { journeyCopy } from "@/content/journey-copy";
import type { Status } from "@/lib/engine/types";

interface StatusSegmentProps {
  disabled: boolean;
  onChange: (status: "none" | "applied" | "stuck") => void;
  status: Status;
}

const editableStatuses = ["none", "applied", "stuck"] as const;

export function StatusSegment({
  disabled,
  onChange,
  status,
}: StatusSegmentProps) {
  return (
    <div className="status-segment">
      {editableStatuses.map((value) => (
        <button
          aria-pressed={status === value}
          disabled={disabled || status === "done"}
          key={value}
          onClick={() => onChange(value)}
          type="button"
        >
          {journeyCopy.list.status[value]}
        </button>
      ))}
    </div>
  );
}
