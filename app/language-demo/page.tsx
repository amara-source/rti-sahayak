import type { Metadata } from "next";
import Link from "next/link";
import { TranslationDemo } from "@/components/model/TranslationDemo";
import { modelCopy } from "@/content/model-copy";

export const metadata: Metadata = { title: modelCopy.translate.heading };

export default function LanguageDemoPage() {
  return (
    <section className="language-demo-page">
      <div className="site-shell language-demo-page__inner">
        <Link className="back-link" href="/haq">
          {modelCopy.translate.back}
        </Link>
        <header className="language-demo-header">
          <p>{modelCopy.translate.eyebrow}</p>
          <h1>{modelCopy.translate.heading}</h1>
          <span>{modelCopy.translate.description}</span>
          <small>{modelCopy.translate.synthetic}</small>
        </header>
        <TranslationDemo />
      </div>
    </section>
  );
}
