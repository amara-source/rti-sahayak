"use client";

import { useEffect, useRef, useState } from "react";
import { useCopy } from "@/lib/i18n/LanguageProvider";
import { languages, unbuiltLanguages } from "@/lib/i18n/languages";

/**
 * Real language switching for the interface.
 *
 * The two built languages and Kannada sit in the strip itself. Behind the
 * dropdown are the remaining languages of the Eighth Schedule, every one of
 * them listed as not built. None of them is selectable, and none pretends to
 * be: a half translated interface would be worse than an honest gap. They are
 * shown rather than hidden because the gap is the point. Someone filing in
 * Odia has the same right under the Act and no interface in their language.
 */
export function LanguagePicker() {
  const { language, setLanguage, shell } = useCopy();
  const copy = shell.languagePicker;
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    function onDocumentPointerDown(event: MouseEvent) {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocumentPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onDocumentPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div aria-label={copy.label} className="language-picker" role="group">
      {languages.map((item) => (
        <button
          aria-pressed={language === item.code}
          className={language === item.code ? "is-selected" : undefined}
          disabled={!item.built}
          key={item.code}
          lang={item.code}
          onClick={() => setLanguage(item.code)}
          title={item.built ? undefined : copy.notBuilt}
          type="button"
        >
          {item.label}
        </button>
      ))}

      <div className="language-more" ref={wrapRef}>
        <button
          aria-expanded={open}
          className="language-more__toggle"
          onClick={() => setOpen((value) => !value)}
          type="button"
        >
          {copy.more}
          <span aria-hidden="true">{open ? "▲" : "▼"}</span>
        </button>

        {open ? (
          <div className="language-more__panel">
            <p className="language-more__note">{copy.moreNote}</p>
            <ul>
              {unbuiltLanguages.map((item) => (
                <li key={item.tag}>
                  <span lang={item.tag}>{item.label}</span>
                  <small>{copy.notBuilt}</small>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}
