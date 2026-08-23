import Link from "next/link";
import { AbstractIcon } from "@/components/home/AbstractIcon";
import { landingCopy } from "@/content/landing-copy";
import { lifeEventClusters } from "@/content/landing-events";
import { marketingCopy } from "@/content/marketing-copy";
import { AccessOptions } from "./AccessOptions";
import { CardCarousel } from "./CardCarousel";
import { HeroCarousel } from "./HeroCarousel";
import { LazySection } from "./LazySection";

function StateLineIcon({ index }: { index: number }) {
  const roofs = [16, 20, 13, 18];
  return (
    <svg aria-hidden="true" viewBox="0 0 64 64">
      <path d={`M10 50h44M16 50V29h32v21M${roofs[index]} 29 32 14 48 29M23 50V36h18v14M28 36v14M36 36v14`} />
      <circle cx="32" cy="23" r="3" />
    </svg>
  );
}

function SectionHeading({ heading, subline }: { heading: string; subline: string }) {
  return (
    <header className="marketing-section-heading">
      <h2>{heading}</h2>
      <p>{subline}</p>
    </header>
  );
}

export function LandingPage() {
  return (
    <div className="marketing-landing">
      <HeroCarousel />

      <section className="marketing-stats">
        <div className="site-shell marketing-stats__grid">
          {marketingCopy.stats.items.map((item, index) => (
            <article key={item.label}>
              <span className="marketing-stat-icon"><AbstractIcon name={index % 2 ? "work" : "place"} /></span>
              <div>
                <h2>{item.label}</h2>
                <dl>
                  {item.values.map((value) => (
                    <div key={value.name}><dt>{value.name}</dt><dd>{value.value}</dd></div>
                  ))}
                </dl>
              </div>
            </article>
          ))}
        </div>
        <p className="site-shell marketing-stats__caption">{marketingCopy.stats.caption}</p>
      </section>

      <LazySection>
        <section className="marketing-section whats-new-section">
          <div className="site-shell">
            <SectionHeading heading={marketingCopy.newServices.heading} subline={marketingCopy.newServices.subline} />
            <aside className="weather-promo">
              <span><AbstractIcon name="place" /></span>
              <div><strong>{marketingCopy.newServices.promoTitle}</strong><p>{marketingCopy.newServices.promoBody}</p><Link href="/honesty">{marketingCopy.newServices.promoAction}</Link></div>
            </aside>
            <CardCarousel items={marketingCopy.newServices.items} />
          </div>
        </section>
      </LazySection>

      <LazySection>
        <section className="marketing-section popular-section">
          <div className="site-shell">
            <SectionHeading heading={marketingCopy.popular.heading} subline={marketingCopy.popular.subline} />
            <div className="popular-service-grid">
              {marketingCopy.popular.items.map((item, index) => (
                <Link href="/services" key={item}><span><AbstractIcon name={index % 2 ? "identity" : "work"} /></span><strong>{item}</strong></Link>
              ))}
            </div>
          </div>
        </section>
      </LazySection>

      <LazySection>
        <section className="marketing-section trending-section">
          <div className="site-shell">
            <SectionHeading heading={marketingCopy.trending.heading} subline={marketingCopy.trending.subline} />
            <CardCarousel items={marketingCopy.trending.items} />
          </div>
        </section>
      </LazySection>

      <LazySection>
        <section className="marketing-section states-section">
          <div className="site-shell states-section__inner">
            <div className="state-card-stage">
              {marketingCopy.states.states.map((state, index) => (
                <Link href={`/services?state=${state.toLowerCase()}`} key={state}>
                  <span><StateLineIcon index={index} /></span>
                  <strong>{state}</strong>
                </Link>
              ))}
            </div>
            <div className="states-section__copy">
              <h2>{marketingCopy.states.heading}</h2>
              <p>{marketingCopy.states.description}</p>
              <Link href="/services">{marketingCopy.states.action}</Link>
            </div>
          </div>
        </section>
      </LazySection>

      <LazySection>
        <section className="life-events-band" id="life-events">
          <div className="site-shell">
            <SectionHeading heading={marketingCopy.lifeEvents.heading} subline={marketingCopy.lifeEvents.description} />
            <div className="life-events-band__grid">
              {lifeEventClusters.map((cluster) => {
                const tierOne = cluster.events.find((event) => event.tier === 1);
                const tierTwo = cluster.events.find((event) => event.tier === 2);
                const featured = [tierOne, tierTwo].filter(Boolean);
                return (
                  <article key={cluster.name}>
                    <span className="life-event-illustration"><AbstractIcon name={cluster.icon} /></span>
                    <h3>{cluster.name}</h3>
                    <ul>
                      {featured.map((event) => event ? (
                        <li key={event.eventId}>
                          <Link href={`/events/${event.eventId}`}>
                            {event.label}
                            {event.tier === 1 ? <small>{marketingCopy.lifeEvents.guided}</small> : null}
                          </Link>
                        </li>
                      ) : null)}
                    </ul>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      </LazySection>

      <LazySection>
        <section className="marketing-section marketing-categories" id="categories">
          <div className="site-shell">
            <div className="marketing-section-row">
              <SectionHeading heading={marketingCopy.categories.heading} subline={marketingCopy.categories.description} />
              <Link href="/services">{marketingCopy.categories.action}</Link>
            </div>
            <div className="marketing-category-grid">
              {landingCopy.categories.items.slice(0, 6).map((category) => (
                <Link href={`/services?category=${category.id}`} key={category.id}>
                  <span><AbstractIcon name={category.icon} /></span>
                  <div><strong>{category.label}</strong><small>{category.description}</small></div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </LazySection>

      <LazySection>
        <section className="marketing-section marketing-haq">
          <div className="site-shell marketing-haq__inner">
            <p>{marketingCopy.haq.eyebrow}</p><h2>{marketingCopy.haq.heading}</h2><span>{marketingCopy.haq.body}</span><Link href="/haq">{marketingCopy.haq.action}</Link>
          </div>
        </section>
      </LazySection>

      <LazySection>
        <section className="marketing-section help-section">
          <div className="site-shell help-card">
            <div><h2>{marketingCopy.help.heading}</h2><p>{marketingCopy.help.body}</p><a href={`tel:${marketingCopy.help.number}`}>{marketingCopy.help.number}</a></div>
            <div className="support-illustration" aria-label={marketingCopy.help.illustration}><span /><span /><span /></div>
          </div>
        </section>
      </LazySection>

      <LazySection>
        <section className="marketing-section access-section">
          <div className="site-shell access-section__inner">
            <div className="qr-preview"><span className="qr-preview__code" aria-hidden="true" /><strong>{marketingCopy.access.qr}</strong></div>
            <div><h2>{marketingCopy.access.heading}</h2><AccessOptions /><p className="access-note">{marketingCopy.access.note}</p><div className="social-row"><strong>{marketingCopy.access.follow}</strong>{marketingCopy.access.social.map((item) => <span key={item}>{item}</span>)}</div></div>
          </div>
        </section>
      </LazySection>
    </div>
  );
}
