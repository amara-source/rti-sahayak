import Link from "next/link";
import { layoutCopy } from "@/content/layout-copy";
import { shellCopy } from "@/content/shell-copy";

export function Header() {
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
            <span className="brand__tagline">{layoutCopy.tagline}</span>
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
          <Link
            aria-label={shellCopy.loggedOut.search}
            className="header-search-link"
            href="/#service-search"
          >
            <span aria-hidden="true">⌕</span>
          </Link>
          <Link className="demo-profile-link" href="/login">
            {shellCopy.loggedOut.login}
          </Link>
        </div>
      </div>
    </header>
  );
}
