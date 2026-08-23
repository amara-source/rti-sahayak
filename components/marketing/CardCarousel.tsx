"use client";

import { useState } from "react";
import { AbstractIcon } from "@/components/home/AbstractIcon";
import { marketingCopy } from "@/content/marketing-copy";

interface CardCarouselProps {
  items: readonly string[];
}

export function CardCarousel({ items }: CardCarouselProps) {
  const [page, setPage] = useState(0);
  const pageCount = Math.max(1, Math.ceil(items.length / 4));
  const visible = Array.from({ length: Math.min(4, items.length) }, (_, offset) =>
    items[(page * 4 + offset) % items.length],
  );

  return (
    <div className="marketing-card-carousel">
      <button aria-label={marketingCopy.carousel.previous} onClick={() => setPage((current) => (current - 1 + pageCount) % pageCount)} type="button">‹</button>
      <div>
        {visible.map((item, index) => (
          <article key={`${item}-${index}`}>
            <span className="service-placeholder-icon"><AbstractIcon name={index % 2 ? "identity" : "work"} /></span>
            <strong>{item}</strong>
          </article>
        ))}
      </div>
      <button aria-label={marketingCopy.carousel.next} onClick={() => setPage((current) => (current + 1) % pageCount)} type="button">›</button>
      <div className="carousel-dots marketing-card-carousel__dots">
        {Array.from({ length: pageCount }, (_, index) => (
          <button aria-label={marketingCopy.carousel.select(index)} aria-pressed={index === page} key={index} onClick={() => setPage(index)} type="button" />
        ))}
      </div>
    </div>
  );
}
