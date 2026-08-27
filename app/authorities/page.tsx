import { listAuthorities } from "@/lib/engine/authority";
import { AuthorityDirectory } from "@/components/rti/AuthorityDirectory";
import { PageHero } from "@/components/rti/PageHero";

export default function AuthoritiesPage() {
  // The directory lists both governments now, minus the two fallbacks.
  const authorities = listAuthorities().filter(
    (authority) => !authority.id.startsWith("unknown_"),
  );

  return (
    <article className="directory-page">
      <PageHero
        eyebrow="Central and state public authorities"
        illustration="/illustrations/authority.png"
        supporting="Find an officer title and public authority by subject. Check the live government directory before filing because assignments can change."
        title="Who should receive your RTI request?"
        tone="teal"
      />
      <section className="directory-page__content rti-overlap-card">
        <AuthorityDirectory authorities={authorities} />
      </section>
    </article>
  );
}
