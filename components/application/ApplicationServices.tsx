"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AbstractIcon } from "@/components/home/AbstractIcon";
import { applicationServicesCopy } from "@/content/application-services-copy";
import { landingCopy } from "@/content/landing-copy";
import { serviceCatalog } from "@/content/service-catalog";

export function ApplicationServices({ categoryId }: { categoryId?: string }) {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>(applicationServicesCopy.explore.tabs[0].id);
  const normalized = query.trim().toLowerCase();
  const groups = useMemo(
    () => applicationServicesCopy.groups.map((group) => ({
      ...group,
      services: group.services.filter((service) => service.toLowerCase().includes(normalized)),
    })).filter((group) => group.services.length > 0),
    [normalized],
  );
  const tab = applicationServicesCopy.explore.tabs.find((item) => item.id === activeTab) ?? applicationServicesCopy.explore.tabs[0];
  const selectedCategory = landingCopy.categories.items.find((category) => category.id === categoryId);
  const selectedServices = selectedCategory
    ? serviceCatalog.filter((service) => service.categoryId === selectedCategory.id)
    : [];

  return (
    <div className="application-services-page">
      <header className="application-services-header">
        <div><p>{applicationServicesCopy.eyebrow}</p><h1>{applicationServicesCopy.heading}</h1></div>
        <div>
          <label className="sr-only" htmlFor="page-service-filter">{applicationServicesCopy.searchLabel}</label>
          <input id="page-service-filter" onChange={(event) => setQuery(event.target.value)} placeholder={applicationServicesCopy.searchPlaceholder} type="search" value={query} />
          {query ? <button onClick={() => setQuery("")} type="button">{applicationServicesCopy.clear}</button> : null}
        </div>
      </header>

      <section className="application-services-promo">
        <p>{applicationServicesCopy.promo.eyebrow}</p><h2>{applicationServicesCopy.promo.heading}</h2><span>{applicationServicesCopy.promo.body}</span><Link href="/events">{applicationServicesCopy.promo.action}</Link>
      </section>

      {selectedCategory ? (
        <section className="selected-category-panel" id="category-result">
          <p>{applicationServicesCopy.categoryResult}</p>
          <h2>{selectedCategory.label}</h2>
          <span>{selectedCategory.description}</span>
          <ul>
            {selectedServices.map((service) => (
              <li key={service.id}>
                {service.eventId ? <Link href={`/events/${service.eventId}`}>{service.label}</Link> : <span>{service.label}</span>}
                <small>{applicationServicesCopy.categoryListing}</small>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="application-services-section">
        <h2>{applicationServicesCopy.purposeHeading}</h2>
        {groups.length ? (
          <div className="purpose-service-grid">
            {groups.map((group, index) => (
              <article key={group.heading}>
                <span><AbstractIcon name={index === 0 ? "identity" : index === 1 ? "work" : "education"} /></span>
                <h3>{group.heading}</h3>
                <ul>{group.services.map((service) => <li key={service}><Link href={`/app/services?category=${group.categoryId}#category-result`}>{service}</Link></li>)}</ul>
              </article>
            ))}
          </div>
        ) : <p className="service-filter-empty">{applicationServicesCopy.empty}</p>}
      </section>

      <section className="application-services-section explore-services">
        <h2>{applicationServicesCopy.explore.heading}</h2>
        <div className="service-tabs" role="tablist">
          {applicationServicesCopy.explore.tabs.map((item) => (
            <button aria-selected={activeTab === item.id} key={item.id} onClick={() => setActiveTab(item.id)} role="tab" type="button">{item.label}</button>
          ))}
        </div>
        <div className="explore-service-grid" role="tabpanel">
          {tab.items.map((item, index) => <Link href="/app/services" key={item}><span><AbstractIcon name={index % 2 ? "place" : "work"} /></span><strong>{item}</strong></Link>)}
        </div>
      </section>

      <section className="application-services-section" id="all">
        <h2>{applicationServicesCopy.categories}</h2>
        <div className="app-category-grid">
          {landingCopy.categories.items.map((category) => (
            <Link href={`/app/services?category=${category.id}#category-result`} id={category.id === "youth-skills-employment" ? "jobs" : undefined} key={category.id}>
              <span><AbstractIcon name={category.icon} /></span><strong>{category.label}</strong>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
