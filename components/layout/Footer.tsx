import { layoutCopy } from "@/content/layout-copy";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-shell">
        <div className="site-footer__columns">
          {layoutCopy.footerColumns.map((column) => (
            <section key={column.title}>
              <h2>{column.title}</h2>
              <ul>
                {column.links.map((link) => (
                  <li key={link}>{link}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        <p className="site-footer__note">{layoutCopy.footerNote}</p>
      </div>
    </footer>
  );
}
