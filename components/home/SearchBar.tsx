"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { landingCopy } from "@/content/landing-copy";
import { searchIndex } from "@/content/search-index";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const matches = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    if (!normalized) return [];
    return searchIndex
      .filter((item) => item.label.toLocaleLowerCase().includes(normalized))
      .slice(0, 8);
  }, [query]);

  return (
    <form
      className="hero-search"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
      role="search"
    >
      <label className="sr-only" htmlFor="service-search">
        {landingCopy.search.placeholder}
      </label>
      <div className="hero-search__controls">
        <input
          id="service-search"
          onChange={(event) => {
            setQuery(event.target.value);
            setSubmitted(false);
          }}
          placeholder={landingCopy.search.placeholder}
          type="search"
        />
        <button type="submit">{landingCopy.search.button}</button>
      </div>
      {query.trim() ? (
        <div className="hero-search__results" aria-live="polite">
          {matches.length > 0 ? (
            <ul>
              {matches.map((item) => (
                <li key={`${item.type}-${item.href}`}>
                  <Link href={item.href}>
                    <span>{item.label}</span>
                    <small>{item.type}</small>
                  </Link>
                </li>
              ))}
            </ul>
          ) : submitted ? (
            <p>{landingCopy.search.noResults}</p>
          ) : null}
        </div>
      ) : null}
      {submitted && !query.trim() ? (
        <p className="hero-search__note" role="status">
          {landingCopy.search.enterSearch}
        </p>
      ) : null}
    </form>
  );
}
