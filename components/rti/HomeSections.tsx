"use client";

import Link from "next/link";
import { useState } from "react";
import { homeCopy } from "@/content/home-copy";
import { Icon } from "./Icon";
import { checkIcon, nodeIcon } from "@/lib/rti/icon-map";

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
          <span className="rti-icon-tile"><Icon name={trap.ruleKind === "check" ? checkIcon(trap.ruleId) : nodeIcon(trap.ruleId)} /></span>
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
          <TrapCard key={trap.ruleId} trap={trap} />
        ))}
      </ul>
      <Link className="rti-secondary" href={homeCopy.traps.href}>
        {homeCopy.traps.linkLabel}
      </Link>
    </section>
  );
}

export function HelpdeskCard() {
  const copy = homeCopy.helpdesk;

  return (
    <section className="utility-section" aria-labelledby="home-helpdesk-heading">
      <div className="home-helpdesk">
        <div className="home-helpdesk__body">
          <img
            alt=""
            aria-hidden="true"
            className="home-helpdesk__art"
            height={667}
            loading="lazy"
            src="/illustrations/authority.png"
            width={1000}
          />
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

export function ExampleCase() {
  const copy = homeCopy.example;

  return (
    <section className="utility-section" aria-labelledby="home-example-heading">
      <div className="home-example">
        <div className="home-example__copy">
          <p className="home-example__eyebrow">{copy.eyebrow}</p>
          <h2 id="home-example-heading">{copy.heading}</h2>
          <p>{copy.body}</p>
          <Link className="rti-primary" href={copy.href}>{copy.action}</Link>
        </div>
        <img
          alt=""
          aria-hidden="true"
          className="home-example__art"
          height={667}
          loading="lazy"
          src="/illustrations/tracker.png"
          width={1000}
        />
      </div>
    </section>
  );
}
