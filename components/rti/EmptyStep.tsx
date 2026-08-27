"use client";

import Link from "next/link";
import { useCopy } from "@/lib/i18n/LanguageProvider";
import { Icon, type IconName } from "./Icon";

/**
 * The explanatory empty state.
 *
 * Several steps used to render a card containing nothing but a "Back" link
 * when opened directly with no request in the session, which tells a visitor
 * nothing and offers no way forward. Every step now says what it is for, why
 * it is empty, and where to go instead.
 */
export function EmptyStep({
  icon = "form",
  what,
  body,
}: {
  icon?: IconName;
  /** One line describing what this step does, so the page still teaches. */
  what?: string;
  body?: string;
}) {
  // Interface copy in the selected language, English where untranslated.
  const { rti: rtiCopy } = useCopy();
  // The default has to be read here rather than in the parameter list, since
  // it comes from the language context.
  const text = body ?? rtiCopy.empty.body;
  return (
    <section className="rti-empty-step">
      <span className="rti-icon-tile"><Icon name={icon} /></span>
      <h2>{rtiCopy.empty.heading}</h2>
      {what ? (
        <p className="rti-empty-step__what">
          <strong>{rtiCopy.empty.generalHeading}: </strong>
          {what}
        </p>
      ) : null}
      <p>{text}</p>
      <div className="rti-empty-step__actions">
        <Link className="rti-primary" href="/file">{rtiCopy.empty.start}</Link>
        <Link className="rti-secondary" href="/example">{rtiCopy.empty.example}</Link>
      </div>
    </section>
  );
}
