import { landingCopy } from "@/content/landing-copy";
import { SearchBar } from "@/components/home/SearchBar";

export function Hero() {
  return (
    <section className="home-hero">
      <div className="site-shell home-hero__inner">
        <div className="home-hero__copy">
          <h1>{landingCopy.hero.headline}</h1>
          <p>{landingCopy.hero.description}</p>
          <SearchBar />
        </div>
        <div className="home-hero__motif" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>
    </section>
  );
}
