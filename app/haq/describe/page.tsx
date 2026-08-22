import type { Metadata } from "next";
import { ExtractProfile } from "@/components/model/ExtractProfile";
import { modelCopy } from "@/content/model-copy";

export const metadata: Metadata = { title: modelCopy.extract.heading };

export default function DescribeProfilePage() {
  return (
    <section className="describe-profile-page">
      <div className="site-shell describe-profile-page__inner">
        <header className="describe-profile-header">
          <p>{modelCopy.extract.eyebrow}</p>
          <h1>{modelCopy.extract.heading}</h1>
          <span>{modelCopy.extract.description}</span>
          <small>{modelCopy.extract.synthetic}</small>
        </header>
        <ExtractProfile />
      </div>
    </section>
  );
}
