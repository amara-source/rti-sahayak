"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { rtiCopy as englishCopy } from "@/content/rti-copy";
import { useCopy } from "@/lib/i18n/LanguageProvider";
import { loadDraft, type RtiDraft } from "@/lib/rti/draft";
import { listJurisdictions, statePortal } from "@/lib/engine/jurisdictions";
import { listAuthorities } from "@/lib/engine/authority";
import { Icon } from "./Icon";
import { PageHero } from "./PageHero";

/**
 * The state route.
 *
 * A state applicant used to be told the central portal would not accept the
 * request and then left there. The Act applies to state public authorities in
 * exactly the same way, so this sets out the three valid ways to file and then
 * opens the same case tracker with the same clocks.
 *
 * The portal link is only ever shown where the URL was verified. Where it was
 * not, this says so rather than guessing an address.
 */
/**
 * dd/mm/yyyy as a citizen writes it, to the ISO date the engine wants.
 *
 * Returns "" for anything incomplete, impossible or in the future. A native
 * date input was here before and could not be typed into at all, which left
 * the whole state route with no way to reach the tracker.
 */
function isoFromTyped(value: string): string {
  const match = value.trim().match(/^(\d{1,2})\s*\/\s*(\d{1,2})\s*\/\s*(\d{4})$/);
  if (!match) return "";
  const [day, month, year] = [Number(match[1]), Number(match[2]), Number(match[3])];
  if (month < 1 || month > 12 || day < 1 || day > 31) return "";
  const date = new Date(Date.UTC(year, month - 1, day));
  // Rejects the 31st of a 30 day month, and the 29th outside a leap year.
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return "";
  const iso = date.toISOString().slice(0, 10);
  if (iso > new Date().toISOString().slice(0, 10)) return "";
  return iso;
}

/** ISO back to dd/mm/yyyy, for what the picker hands back. */
function typedFromIso(iso: string): string {
  const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return match ? `${match[3]}/${match[2]}/${match[1]}` : "";
}

export function StateFiling() {
  // Interface copy in the selected language, English where untranslated.
  const { rti: rtiCopy } = useCopy();
  const router = useRouter();
  const copy = rtiCopy.stateFiling;
  const [draft, setDraft] = useState<RtiDraft | null>(null);
  const [ready, setReady] = useState(false);
  // What the citizen typed, exactly as typed, and the date it resolves to.
  // They are kept apart so a half typed date never clears itself under the
  // cursor and the button can say why it is not ready yet.
  const [typedDate, setTypedDate] = useState("");
  const filedOn = isoFromTyped(typedDate);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  // Used only when the page is opened directly with no request in session.
  const [browseState, setBrowseState] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- browser-only storage can only be read after mount. This previously ran inside requestAnimationFrame, which never fires in a hidden tab and left the page blank.
    setDraft(loadDraft());
    setReady(true);
  }, []);

  if (!ready) return null;

  // Opened directly with no request in session. The three routes are general
  // guidance, so they are still worth showing, with a selector so a visitor
  // can look up any state.
  const browsing = !draft;
  const state = browsing ? browseState : String(draft?.state ?? "");
  const portal = statePortal(state);
  const jurisdictions = listJurisdictions();
  const authority = listAuthorities().find((item) => item.id === draft?.authorityId);

  async function download() {
    const current = draft!;
    const { buildApplicationPdf } = await import("@/lib/rti/application-pdf");
    const bytes = await buildApplicationPdf({
      authorityName: current.authorityName || rtiCopy.checks.unknownAuthority,
      officer: current.officer || "State Public Information Officer",
      ministry: authority?.ministry || undefined,
      body: current.rewritten || current.rawText,
      date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
      simulated: true,
    });
    const url = URL.createObjectURL(new Blob([bytes as BlobPart], { type: "application/pdf" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "rti-application.pdf";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  async function openCase() {
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/case", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          manualFiling: true,
          extracted: { ...draft, bodyLevel: "state", filedOn: filedOn || undefined },
        }),
      });
      const result = (await response.json()) as { code?: string; error?: string };
      if (!response.ok || !result.code) throw new Error(result.error || "case");
      router.push(`/case/${result.code}`);
    } catch {
      setError(copy.openError);
      setPending(false);
    }
  }

  return (
    <article className="rti-detail-page">
      <PageHero
        eyebrow={copy.eyebrow}
        illustration="/illustrations/submit.png"
        supporting={copy.note}
        title={copy.heading}
        tone="teal"
      />
      <div className="rti-detail-content rti-overlap-card">
        <p className="rti-state-lead">{copy.lead}</p>

        {browsing ? (
          <section className="rti-state-browse">
            <h2>{copy.browseHeading}</h2>
            <p>{copy.browseNote}</p>
            <label className="rti-field">
              <span>{copy.browseLabel}</span>
              <select onChange={(event) => setBrowseState(event.target.value)} value={browseState}>
                <option value="">{copy.browsePlaceholder}</option>
                <optgroup label={rtiCopy.jurisdiction.statesGroup}>
                  {jurisdictions.states.map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </optgroup>
                <optgroup label={rtiCopy.jurisdiction.unionTerritoriesGroup}>
                  {jurisdictions.unionTerritories.map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </optgroup>
              </select>
            </label>
          </section>
        ) : null}

        <h2 className="rti-state-routes__heading">{copy.routesHeading}</h2>
        <ol className="rti-state-routes">
          <li className="rti-state-route">
            <span className="rti-icon-tile rti-icon-tile--sm"><Icon name="two-windows" /></span>
            <div>
              <h3>{copy.portal.title}</h3>
              {portal.url ? (
                <>
                  <p>{copy.portal.verified(state)}</p>
                  <a className="rti-secondary" href={portal.url} rel="noreferrer" target="_blank">
                    {copy.portal.action}
                  </a>
                  <small>{copy.portal.checked(portal.verifiedOn)}</small>
                </>
              ) : (
                <p>{copy.portal.unverified(state || "your state")}</p>
              )}
            </div>
          </li>

          <li className="rti-state-route">
            <span className="rti-icon-tile rti-icon-tile--sm"><Icon name="post-box" /></span>
            <div>
              <h3>{copy.post.title}</h3>
              <p>{copy.post.body}</p>
              <p className="rti-state-route__why">{copy.post.why}</p>
              {browsing ? null : (
                <button className="rti-secondary" onClick={download} type="button">
                  {copy.post.action}
                </button>
              )}
            </div>
          </li>

          <li className="rti-state-route">
            <span className="rti-icon-tile rti-icon-tile--sm"><Icon name="transfer" /></span>
            <div>
              <h3>{copy.apio.title}</h3>
              <p>{copy.apio.body}</p>
              <p className="rti-state-route__why">{copy.apio.why}</p>
            </div>
          </li>
        </ol>

        {browsing ? (
          <section className="rti-state-date">
            <h2>{copy.startYours}</h2>
            <Link className="rti-primary" href="/file">{copy.startYoursAction}</Link>
          </section>
        ) : (
        <section className="rti-state-date">
          <h2>{copy.dateHeading}</h2>
          <label className="rti-field rti-date-field">
            <span>{copy.dateLabel}</span>
            <span className="rti-date-field__controls">
              {/* Typed entry is a plain text field. A native date input cannot
                  be typed into reliably, and this route has to be usable
                  without reaching for the picker at all. */}
              <input
                autoComplete="off"
                inputMode="numeric"
                onChange={(event) => setTypedDate(event.target.value)}
                placeholder={copy.datePlaceholder}
                type="text"
                value={typedDate}
              />
              {/* And the picker, for anyone who would rather choose one. */}
              <input
                aria-label={copy.datePickerLabel}
                className="rti-date-field__picker"
                max={new Date().toISOString().slice(0, 10)}
                onChange={(event) => setTypedDate(typedFromIso(event.target.value))}
                type="date"
                value={filedOn}
              />
            </span>
            <small>{copy.dateNote}</small>
          </label>
          <button
            className="rti-primary"
            disabled={pending || !filedOn}
            onClick={openCase}
            type="button"
          >
            {pending ? rtiCopy.common.loading : copy.open}
          </button>
          {/* Never fails on click: it says what is missing before you press it. */}
          {!filedOn ? (
            <small className="rti-disabled-reason">
              {typedDate.trim() ? copy.dateInvalid : copy.dateRequired}
            </small>
          ) : null}
          {error ? <p className="rti-error" role="alert">{error}</p> : null}
        </section>
        )}

        <p className="rti-note">{copy.appealNote}</p>
      </div>
    </article>
  );
}
