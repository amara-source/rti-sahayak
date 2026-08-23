import Link from "next/link";
import { landingCopy } from "@/content/landing-copy";
import { serviceCatalog } from "@/content/service-catalog";

interface ServicesPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function ServicesPage({ searchParams }: ServicesPageProps) {
  const { category: categoryId } = await searchParams;
  const selected = landingCopy.categories.items.find(
    (category) => category.id === categoryId,
  );
  const categories = selected ? [selected] : landingCopy.categories.items;

  return (
    <section className="catalog-page">
      <div className="site-shell catalog-page__inner">
        <p className="catalog-page__eyebrow">Service catalogue</p>
        <h1>{selected?.label ?? "All services"}</h1>
        <p>
          Static catalogue entries and guided services available in this prototype.
        </p>
        {selected ? <Link className="back-link" href="/services">View all categories</Link> : null}
        <div className="catalog-sections">
          {categories.map((category) => {
            const services = serviceCatalog.filter(
              (service) => service.categoryId === category.id,
            );
            return (
              <section key={category.id}>
                <h2>{category.label}</h2>
                <p>{category.description}</p>
                <ul>
                  {services.map((service) => (
                    <li id={service.id} key={service.id}>
                      <span>{service.label}</span>
                      {service.eventId ? (
                        <Link href={`/events/${service.eventId}`}>Open guided journey</Link>
                      ) : (
                        <small>Catalogue listing</small>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </div>
    </section>
  );
}
