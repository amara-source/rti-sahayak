"use client";

import { MockBadge } from "@/components/shared/MockBadge";
import { useCopy } from "@/lib/i18n/LanguageProvider";

interface SyncControlProps {
  error: string | null;
  isPending: boolean;
  onSimulate: () => void;
  summary: string | null;
}

export function SyncControl({
  error,
  isPending,
  onSimulate,
  summary,
}: SyncControlProps) {
  // Interface copy in the selected language, English where untranslated.
  const { tracker: trackerCopy } = useCopy();
  return (
    <section className="sync-control">
      <header>
        <div>
          <p>{trackerCopy.control.eyebrow}</p>
          <h2>{trackerCopy.control.heading}</h2>
        </div>
        <MockBadge />
      </header>
      <p>{trackerCopy.control.description}</p>
      <button
        className="sync-trigger"
        disabled={isPending}
        onClick={onSimulate}
        type="button"
      >
        {isPending
          ? trackerCopy.control.pending
          : trackerCopy.control.trigger}
      </button>
      <small>{trackerCopy.control.note}</small>
      {summary ? (
        <p className="sync-control__summary" role="status">
          {summary}
        </p>
      ) : null}
      {error ? (
        <p className="sync-control__error" role="alert">
          {error}
        </p>
      ) : null}
    </section>
  );
}
