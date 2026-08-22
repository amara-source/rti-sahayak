import Link from "next/link";
import { modelCopy } from "@/content/model-copy";

export function HaqModelActions() {
  return (
    <section className="haq-model-actions" aria-labelledby="model-entry-heading">
      <header>
        <p>{modelCopy.entry.label}</p>
        <h2 id="model-entry-heading">{modelCopy.entry.description}</h2>
      </header>
      <div className="haq-model-action-grid">
        <article>
          <h3>{modelCopy.entry.extract.title}</h3>
          <p>{modelCopy.entry.extract.line}</p>
          <Link href="/haq/describe">{modelCopy.entry.extract.action}</Link>
        </article>
        <article>
          <h3>{modelCopy.entry.translate.title}</h3>
          <p>{modelCopy.entry.translate.line}</p>
          <Link href="/language-demo">{modelCopy.entry.translate.action}</Link>
        </article>
      </div>
    </section>
  );
}
