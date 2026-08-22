import Link from "next/link";
import { layoutCopy } from "@/content/layout-copy";

export function Header() {
  return (
    <header className="site-header">
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

        <nav className="primary-nav">
          {layoutCopy.navigation.map((item) => (
            <Link key={item.label} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <Link className="demo-profile-link" href="/haq">
          {layoutCopy.account}
        </Link>
      </div>
    </header>
  );
}
