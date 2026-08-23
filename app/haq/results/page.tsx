import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { EntitlementCard } from "@/components/haq/EntitlementCard";
import { HiddenCount } from "@/components/haq/HiddenCount";
import { HaqComparison } from "@/components/haq/HaqComparison";
import { haqCopy } from "@/content/haq-copy";
import { computeEntitlements } from "@/lib/engine/entitlement";
import { missingEntitlementFields } from "@/lib/engine/profile-fields";
import type { Entitlement } from "@/lib/engine/types";
import { cookieHaqProfileStorage } from "@/lib/haq/storage";

export const metadata: Metadata = { title: haqCopy.results.heading };

const sections = ["overdue", "available", "upcoming"] as const;

export default async function HaqResultsPage() {
  const storage = cookieHaqProfileStorage(await cookies());
  const profile = await storage.load();
  const result = computeEntitlements(profile);
  const missingFields = missingEntitlementFields(profile);
  const grouped = new Map<Entitlement["section"], Entitlement[]>(
    sections.map((section) => [section, []]),
  );

  for (const entitlement of result.entitlements) {
    grouped.get(entitlement.section)?.push(entitlement);
  }

  return (
    <section className="haq-results-page">
      <div className="site-shell haq-results-page__inner">
        <header className="haq-results-header">
          <p>{haqCopy.results.eyebrow}</p>
          <h1>{haqCopy.results.heading}</h1>
          <span>{haqCopy.results.description}</span>
          <Link className="haq-edit-link" href="/haq">
            {haqCopy.results.edit}
          </Link>
        </header>

        <HaqComparison>
          <HiddenCount
            fields={missingFields}
            hiddenCount={result.hiddenCount}
          />

          <div className="entitlement-sections">
            {sections.map((section) => {
              const items = grouped.get(section) ?? [];

              return (
                <section className="entitlement-section" key={section}>
                  <header className="entitlement-section__header">
                    <h2>{haqCopy.results.section[section]}</h2>
                    <span>{items.length}</span>
                  </header>
                  {items.length > 0 ? (
                    <div className="entitlement-list">
                      {items.map((entitlement) => (
                        <EntitlementCard
                          entitlement={entitlement}
                          key={entitlement.id}
                          profile={profile}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="entitlement-empty">{haqCopy.results.empty}</p>
                  )}
                </section>
              );
            })}
          </div>
        </HaqComparison>
      </div>
    </section>
  );
}
