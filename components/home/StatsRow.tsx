import { landingCopy } from "@/content/landing-copy";

export function StatsRow() {
  return (
    <section className="stats-section">
      <div className="site-shell">
        <dl className="stats-row">
          {landingCopy.stats.items.map((item) => (
            <div key={item.label}>
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>
        <p className="stats-caption">{landingCopy.stats.caption}</p>
      </div>
    </section>
  );
}
