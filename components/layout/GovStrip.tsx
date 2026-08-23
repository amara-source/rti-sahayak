import { layoutCopy } from "@/content/layout-copy";
import { LangSwitch } from "@/components/layout/LangSwitch";
import { FontSizeControls } from "@/components/layout/FontSizeControls";

export function GovStrip() {
  return (
    <div className="utility-strip">
      <div className="site-shell utility-strip__inner">
        <a className="skip-link" href="#main-content">
          {layoutCopy.skipToMain}
        </a>
        <div className="utility-strip__tools">
          <FontSizeControls />
          <span className="utility-strip__divider" aria-hidden="true" />
          <LangSwitch />
        </div>
      </div>
    </div>
  );
}
