import authoritiesJson from "@/rules/rti/authorities.json";
import { AuthorityDirectory } from "@/components/rti/AuthorityDirectory";
import { PageHero } from "@/components/rti/PageHero";

export default function AuthoritiesPage() {
  const authorities = authoritiesJson.authorities.filter(
    (authority) => authority.id !== "unknown_central",
  );

  return (
    <article className="directory-page">
      <PageHero
        eyebrow="Central public authorities"
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
