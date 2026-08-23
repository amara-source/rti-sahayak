import Link from "next/link";
import { shellCopy } from "@/content/shell-copy";
import { VisitorCounter } from "./VisitorCounter";

export function Footer() {
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
              {"subheading" in column ? (
                <>
                  <h3>{column.subheading}</h3>
                  <ul>
                    {column.secondary.map((link) => (
                      <li key={link.label}><Link href={link.href}>{link.label}</Link></li>
                    ))}
                  </ul>
                </>
              ) : null}
              {column.title === "Useful links" ? <VisitorCounter /> : null}
            </section>
          ))}
        </div>
        <div className="site-footer__note">
          <p>{shellCopy.footer.ownership}</p>
          <p>{shellCopy.footer.updated}</p>
        </div>
      </div>
    </footer>
  );
}
