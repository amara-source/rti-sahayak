import Link from "next/link";
import type { UtilityPageCopy } from "@/content/utility-copy";
import { Icon } from "./Icon";
import type { IconName } from "./Icon";
import { PageHero } from "./PageHero";

export function UtilityPage({
  copy,
  children,
  className,
}: {
  copy: UtilityPageCopy;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <article className={className ? `utility-page ${className}` : "utility-page"}>
      <PageHero eyebrow={copy.eyebrow} illustration={copy.illustration} supporting={copy.intro} title={copy.heading} tone={copy.tone} />
      <div className="utility-page__content rti-overlap-card">
        {copy.sections.map((section) => (
          <section className="utility-section" key={section.heading}>
            <div className="utility-section__heading">
              <h2>{section.heading}</h2>
              {section.intro ? <p>{section.intro}</p> : null}
            </div>
            <div className="utility-card-grid">
              {section.cards.map((card) => (
                <article className={card.featured ? "utility-card utility-card--featured" : "utility-card"} key={card.title}>
                  {card.icon ? (
                    <span className="rti-icon-tile">
                      <Icon name={card.icon as IconName} />
                    </span>
                  ) : null}
                  <h3>{card.title}</h3>
                  {card.detail ? <strong>{card.detail}</strong> : null}
                  <p>{card.body}</p>
                  {card.href && card.linkLabel ? (
                    card.href.startsWith("http") || card.href.startsWith("tel:")
                      ? <a href={card.href} rel={card.href.startsWith("http") ? "noreferrer" : undefined} target={card.href.startsWith("http") ? "_blank" : undefined}>{card.linkLabel}</a>
                      : <Link href={card.href}>{card.linkLabel}</Link>
                  ) : null}
                </article>
              ))}
            </div>
          </section>
        ))}
        {children}
      </div>
    </article>
  );
}
