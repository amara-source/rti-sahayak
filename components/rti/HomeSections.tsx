"use client";

import Link from "next/link";
import { useState } from "react";
import { homeCopy } from "@/content/home-copy";
import { Icon } from "./Icon";
import { checkIcon, conceptIcons } from "@/lib/rti/icon-map";

/**
 * The five traps.
 *
 * Each card is a real button, so it works with a keyboard and a screen reader
 * and announces its state. Pointers that support hover get the flip; coarse
 * pointers get the same content as an expansion, because a hover-only reveal
 * is unusable on a phone.
 */
function TrapCard({ trap }: { trap: (typeof homeCopy.traps.items)[number] }) {
  const [open, setOpen] = useState(false);

  return (
    <li className={open ? "trap-card is-open" : "trap-card"}>
      <button
        aria-expanded={open}
        className="trap-card__button"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <span className="trap-card__face trap-card__front">
          <span className="rti-icon-tile"><Icon name={checkIcon(trap.checkId)} /></span>
          <strong>{trap.title}</strong>
          <span className="trap-card__line">{trap.front}</span>
          <span className="trap-card__hint">{homeCopy.traps.flipHint}</span>
        </span>
        <span className="trap-card__face trap-card__back">
          <strong>{trap.title}</strong>
          <span className="trap-card__line">{trap.back}</span>
          <small>{trap.basis}</small>
          <span className="trap-card__hint">{homeCopy.traps.backHint}</span>
        </span>
      </button>
    </li>
  );
}

export function TrapCards() {
  return (
    <section className="utility-section home-traps" aria-labelledby="home-traps-heading">
      <div className="utility-section__heading">
        <h2 id="home-traps-heading">{homeCopy.traps.heading}</h2>
        <p>{homeCopy.traps.intro}</p>
      </div>
      <ul className="trap-grid">
        {homeCopy.traps.items.map((trap) => (
          <TrapCard key={trap.checkId} trap={trap} />
        ))}
      </ul>
      <Link className="rti-secondary" href={homeCopy.traps.href}>
        {homeCopy.traps.linkLabel}
      </Link>
    </section>
  );
}

export function WhyThisExists() {
  return (
    <section className="utility-section" aria-labelledby="home-why-heading">
      <div className="utility-section__heading">
        <h2 id="home-why-heading">{homeCopy.why.heading}</h2>
      </div>
      <div className="utility-card-grid">
        {homeCopy.why.cards.map((card) => (
          <article className="utility-card" key={card.title}>
            <span className="rti-icon-tile"><Icon name={conceptIcons[card.icon]} /></span>
            <h3>{card.title}</h3>
            <p>{card.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function HelpdeskCard() {
  const copy = homeCopy.helpdesk;

  return (
    <section className="utility-section" aria-labelledby="home-helpdesk-heading">
      <div className="home-helpdesk">
        <div className="home-helpdesk__body">
          <h2 id="home-helpdesk-heading">{copy.heading}</h2>
          <p>{copy.intro}</p>
          <ul className="home-helpdesk__numbers">
            {copy.numbers.map((number) => (
              <li key={number}>
                <a href={`tel:+91${number.replace(/\D/g, "")}`}>{number}</a>
              </li>
            ))}
          </ul>
          <p className="home-helpdesk__hours">{copy.hours}</p>
          <p className="home-helpdesk__disclaimer">{copy.disclaimer}</p>
          <a
            className="rti-secondary"
            href={copy.portalHref}
            rel="noreferrer"
            target="_blank"
          >
            {copy.portalLabel}
          </a>
        </div>
      </div>
    </section>
  );
}
