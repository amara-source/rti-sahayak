import { layoutCopy } from "@/content/layout-copy";

export function DisclaimerStrip() {
  return (
    <div className="disclaimer-strip">
      <div className="site-shell">{layoutCopy.disclaimer}</div>
    </div>
  );
}
