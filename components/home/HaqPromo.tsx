import Link from "next/link";
import { landingCopy } from "@/content/landing-copy";

export function HaqPromo() {
  return (
    <section className="haq-promo">
      <div className="site-shell haq-promo__inner">
        <div>
          <h2>{landingCopy.haq.heading}</h2>
          <p>{landingCopy.haq.line}</p>
        </div>
        <Link className="primary-link" href="/haq">
          {landingCopy.haq.button}
        </Link>
      </div>
    </section>
  );
}
