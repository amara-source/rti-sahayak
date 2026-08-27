"use client";

import Link from "next/link";
import { useCopy } from "@/lib/i18n/LanguageProvider";
import { layoutCopy } from "@/content/layout-copy";

export function Header() {
  // Interface copy in the selected language, English where untranslated.
  const { shell: shellCopy } = useCopy();
  return (
    <header className="site-header marketing-header">
      <div className="site-shell site-header__inner">
        <Link className="brand" href="/">
          <span className="brand__mark" aria-hidden="true">
            <span />
            <span />
          </span>
          <span>
            <span className="brand__wordmark">{layoutCopy.wordmark}</span>
            <span className="brand__full-name">{layoutCopy.fullName}</span>
          </span>
        </Link>

        <nav className="primary-nav" aria-label="Primary navigation">
          {shellCopy.loggedOut.nav.map((item) => (
            <Link key={item.label} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="marketing-header__actions">
          <Link className="demo-profile-link" href="/file">
            {shellCopy.loggedOut.login}
          </Link>
        </div>
      </div>
    </header>
  );
}
