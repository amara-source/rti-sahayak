"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AbstractIcon } from "@/components/home/AbstractIcon";
import { dashboardCopy } from "@/content/dashboard-copy";
import { shellCopy } from "@/content/shell-copy";

function personaScore() {
  if (typeof window === "undefined") return shellCopy.personas[0].score;
  const id = window.localStorage.getItem("umang-demo-persona");
  return shellCopy.personas.find((persona) => persona.id === id)?.score ?? shellCopy.personas[0].score;
}

export function DashboardHome() {
  const [slide, setSlide] = useState(0);
  const [saved, setSaved] = useState<string[]>([]);
  const [showAllDocuments, setShowAllDocuments] = useState(false);
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [score, setScore] = useState<number>(shellCopy.personas[0].score);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setScore(personaScore()));
    const timer = window.setInterval(
      () => setSlide((current) => (current + 1) % dashboardCopy.hero.slides.length),
      5_500,
    );
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearInterval(timer);
    };
  }, []);

  const activeSlide = dashboardCopy.hero.slides[slide];
  const visibleDocuments = showAllDocuments
    ? dashboardCopy.documents.items
    : dashboardCopy.documents.items.slice(0, 2);

  return (
    <div className="dashboard-home" id="overview">
      <section className={`dashboard-hero dashboard-hero--${activeSlide.tone}`}>
        <button aria-label={dashboardCopy.hero.previous} onClick={() => setSlide((slide - 1 + dashboardCopy.hero.slides.length) % dashboardCopy.hero.slides.length)} type="button">‹</button>
        <div>
          <p>{activeSlide.eyebrow}</p>
          <h1>{activeSlide.heading}</h1>
          <span>{activeSlide.body}</span>
          <Link href={activeSlide.href}>{activeSlide.action}</Link>
        </div>
        <button aria-label={dashboardCopy.hero.next} onClick={() => setSlide((slide + 1) % dashboardCopy.hero.slides.length)} type="button">›</button>
        <div className="dashboard-hero__dots" role="group" aria-label="Dashboard features">
          {dashboardCopy.hero.slides.map((item, index) => (
            <button aria-label={item.heading} aria-pressed={slide === index} key={item.heading} onClick={() => setSlide(index)} type="button" />
          ))}
        </div>
      </section>

      <p className="dashboard-highlight">{dashboardCopy.highlight}</p>

      <section className="dashboard-section">
        <h2>{dashboardCopy.quick.heading}</h2>
        <div className="quick-service-grid">
          {dashboardCopy.quick.items.map((item, index) => (
            <Link className={`quick-service quick-service--${item.tone}`} href={item.href} key={item.label}>
              <span><AbstractIcon name={index === 0 ? "health" : index === 1 ? "legal" : index === 2 ? "travel" : "money"} /></span>
              <div><strong>{item.label}</strong><small>{item.detail}</small></div>
            </Link>
          ))}
        </div>
      </section>

      <div className="dashboard-two-column">
        <section className="dashboard-section dashboard-card">
          <h2>{dashboardCopy.recent.heading}</h2>
          <ul className="recent-service-list">
            {dashboardCopy.recent.items.map((item, index) => {
              const isSaved = saved.includes(item.name);
              return (
                <li key={item.name}>
                  <span><AbstractIcon name={index === 0 ? "work" : index === 1 ? "identity" : "travel"} /></span>
                  <Link href={item.href}><strong>{item.name}</strong><small>{item.category}</small></Link>
                  <button aria-label={`${isSaved ? dashboardCopy.recent.bookmarked : dashboardCopy.recent.bookmark}: ${item.name}`} aria-pressed={isSaved} onClick={() => setSaved((items) => isSaved ? items.filter((name) => name !== item.name) : [...items, item.name])} type="button">{isSaved ? "●" : "○"}</button>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="dashboard-section dashboard-card">
          <div className="dashboard-section__heading">
            <h2>{dashboardCopy.documents.heading}</h2>
            <button onClick={() => setShowAllDocuments((value) => !value)} type="button">
              {showAllDocuments ? dashboardCopy.documents.collapse : `${dashboardCopy.documents.viewAll} (${dashboardCopy.documents.items.length})`}
            </button>
          </div>
          <div className="document-grid">
            {visibleDocuments.map((document) => (
              <article key={document.type}><span aria-hidden="true">DOC</span><strong>{document.type}</strong><small>{document.authority}</small></article>
            ))}
          </div>
        </section>
      </div>

      <section className="dashboard-section helpline-section">
        <h2>{dashboardCopy.helplines.heading}</h2>
        <p>{dashboardCopy.helplines.note}</p>
        <div className="helpline-grid">
          {dashboardCopy.helplines.items.map((item, index) => (
            <article key={item.label}>
              <span className={`helpline-character helpline-character--${index + 1}`} aria-hidden="true"><i /><b /></span>
              <strong>{item.label}</strong>
              <a href={`tel:${item.dial}`}>{item.number}</a>
              {"secondaryDial" in item ? <a className="helpline-secondary" href={`tel:${item.secondaryDial}`}>Call child helpline</a> : null}
              <a className="helpline-source" href={item.sourceUrl} rel="noreferrer" target="_blank">{dashboardCopy.helplines.source}</a>
            </article>
          ))}
        </div>
      </section>

      <section className="profile-completion-banner">
        <div className="profile-score" style={{ "--profile-score": `${score * 10}%` } as React.CSSProperties}>
          <strong>{score}</strong><small>{dashboardCopy.profile.scoreSuffix}</small>
        </div>
        <div><p>{dashboardCopy.profile.eyebrow}</p><h2>{dashboardCopy.profile.message(score)}</h2></div>
        <Link href="/haq">{dashboardCopy.profile.action}</Link>
      </section>

      <div className="dashboard-utility-grid">
        <section className="aqi-card">
          <div className="aqi-gauge"><strong>{dashboardCopy.utilities.aqi.value}</strong></div>
          <div><h2>{dashboardCopy.utilities.aqi.heading}</h2><p>{dashboardCopy.utilities.aqi.label}</p><small>{dashboardCopy.utilities.aqi.note}</small></div>
        </section>
        <section className="calculator-card">
          <h2>{dashboardCopy.utilities.calculator.heading}</h2>
          <p>{dashboardCopy.utilities.calculator.body}</p>
          <button onClick={() => setCalculatorOpen((open) => !open)} type="button">{calculatorOpen ? dashboardCopy.utilities.calculator.close : dashboardCopy.utilities.calculator.action}</button>
          {calculatorOpen ? <small>{dashboardCopy.utilities.calculator.note}</small> : null}
        </section>
      </div>
    </div>
  );
}
