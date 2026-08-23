"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { marketingCopy } from "@/content/marketing-copy";

export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const slides = marketingCopy.hero.slides;

  useEffect(() => {
    const timer = window.setInterval(
      () => setIndex((current) => (current + 1) % slides.length),
      5_500,
    );
    return () => window.clearInterval(timer);
  }, [slides.length]);

  const slide = slides[index];
  const move = (direction: number) =>
    setIndex((current) => (current + direction + slides.length) % slides.length);

  return (
    <section className={`marketing-hero marketing-hero--${slide.tone}`} aria-label={marketingCopy.hero.label}>
      <button aria-label={marketingCopy.hero.previous} className="marketing-hero__arrow marketing-hero__arrow--prev" onClick={() => move(-1)} type="button">‹</button>
      <div className="site-shell marketing-hero__inner">
        <div>
          <p>{slide.eyebrow}</p>
          <h1>{slide.title}</h1>
          <span>{slide.body}</span>
          <Link href={slide.href}>{slide.action}</Link>
        </div>
        <div className="marketing-hero__visual" aria-hidden="true">
          <span /><span /><span />
        </div>
      </div>
      <button aria-label={marketingCopy.hero.next} className="marketing-hero__arrow marketing-hero__arrow--next" onClick={() => move(1)} type="button">›</button>
      <div className="carousel-dots">
        {slides.map((item, itemIndex) => (
          <button aria-label={marketingCopy.hero.select(itemIndex)} aria-pressed={itemIndex === index} key={item.title} onClick={() => setIndex(itemIndex)} type="button" />
        ))}
      </div>
    </section>
  );
}
