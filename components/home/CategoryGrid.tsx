import Link from "next/link";
import { AbstractIcon } from "@/components/home/AbstractIcon";
import { landingCopy } from "@/content/landing-copy";

export function CategoryGrid() {
  return (
    <section className="landing-section categories-section" id="categories">
      <div className="site-shell">
        <div className="section-heading-row">
          <div>
            <h2>{landingCopy.categories.heading}</h2>
            <p>{landingCopy.categories.description}</p>
          </div>
          <Link className="text-link" href="/services">
            {landingCopy.categories.explore}
          </Link>
        </div>

        <div className="category-grid">
          {landingCopy.categories.items.map((category) => (
            <Link
              className="category-card"
              href={`/services?category=${category.id}`}
              key={category.id}
            >
              <span className="icon-field">
                <AbstractIcon name={category.icon} />
              </span>
              <span>
                <strong>{category.label}</strong>
                <small>{category.description}</small>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
