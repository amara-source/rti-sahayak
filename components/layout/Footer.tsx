"use client";

import Link from "next/link";
import { useCopy } from "@/lib/i18n/LanguageProvider";

export function Footer() {
  // Interface copy in the selected language, English where untranslated.
  const { shell: shellCopy } = useCopy();
  return (
    <footer className="site-footer marketing-footer">
      <div className="site-shell">
        <div className="site-footer__columns">
          {shellCopy.footer.columns.map((column) => (
            <section key={column.title}>
              <h2>{column.title}</h2>
              <ul>
                {column.links.map((link) => (
                  <li key={link.label}><Link href={link.href}>{link.label}</Link></li>
                ))}
              </ul>
            </section>
          ))}
          <section className="site-footer__contact">
            <h2>{shellCopy.footer.contact.title}</h2>
            <ul>
              {shellCopy.footer.contact.numbers.map((number) => (
                <li key={number.label}><a href={number.href}>{number.label}</a></li>
              ))}
              <li>{shellCopy.footer.contact.hours}</li>
            </ul>
            <h3>{shellCopy.footer.contact.follow}</h3>
            <div className="footer-social-row" aria-label={shellCopy.footer.contact.socialNote}>
              {shellCopy.footer.contact.socialLabels.map((label, index) => (
                <span aria-hidden="true" className="footer-social-icon" key={label}>
                  {index === 0 ? "X" : index === 1 ? "f" : "▶"}
                </span>
              ))}
              <small>{shellCopy.footer.contact.socialNote}</small>
            </div>
          </section>
        </div>
        <div className="site-footer__note">
          <p>{shellCopy.footer.ownership}</p>
          <p>{shellCopy.footer.updated}</p>
        </div>
      </div>
    </footer>
  );
}
