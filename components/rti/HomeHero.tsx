import Link from "next/link";
import { homeCopy } from "@/content/home-copy";
import { utilityPages } from "@/content/utility-copy";
import { Icon } from "./Icon";

/**
 * The home hero.
 *
 * The illustration is a background layer for the whole band rather than a
 * separate picture beside the text, with a scrim over it so the headline keeps
 * its contrast. The primary action sits in a card overlapping the bottom edge,
 * and the proof chips underneath say only things that are true.
 */
export function HomeHero() {
  const copy = utilityPages.home;

  return (
    <header className="home-band">
      <div aria-hidden="true" className="home-band__art">
        <img alt="" height={667} src={copy.illustration} width={1000} />
      </div>
      <div aria-hidden="true" className="home-band__scrim" />

      <div className="home-band__inner">
        <p className="home-band__eyebrow">{copy.eyebrow}</p>
        <h1>{copy.heading}</h1>
        <p className="home-band__supporting">{copy.intro}</p>
      </div>

      <div className="home-band__action">
        <div className="home-band__action-card">
          <span className="rti-icon-tile"><Icon name="form" /></span>
          <div>
            <strong>{homeCopy.heroAction.title}</strong>
            <span>{homeCopy.heroAction.line}</span>
          </div>
          <Link className="rti-primary" href="/file">{homeCopy.heroAction.action}</Link>
        </div>
        <ul className="home-band__proof">
          {homeCopy.proof.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </header>
  );
}
