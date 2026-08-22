import { landingCopy } from "@/content/landing-copy";

interface SearchBarProps {
  showUnavailable: boolean;
}

export function SearchBar({ showUnavailable }: SearchBarProps) {
  return (
    <form className="hero-search" action="/" method="get" role="search">
      <label className="sr-only" htmlFor="service-search">
        {landingCopy.search.placeholder}
      </label>
      <div className="hero-search__controls">
        <input
          id="service-search"
          name="q"
          placeholder={landingCopy.search.placeholder}
          type="search"
        />
        <button type="submit">{landingCopy.search.button}</button>
      </div>
      {showUnavailable ? (
        <p className="hero-search__note" role="status">
          {landingCopy.search.unavailable}
        </p>
      ) : null}
    </form>
  );
}
