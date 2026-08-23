import { layoutCopy } from "@/content/layout-copy";
import { LangSwitch } from "@/components/layout/LangSwitch";
import { FontSizeControls } from "@/components/layout/FontSizeControls";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { shellCopy } from "@/content/shell-copy";

export function GovStrip() {
  return (
    <div className="utility-strip utility-strip--marketing">
      <div className="site-shell utility-strip__inner">
        <span
          aria-label={shellCopy.loggedOut.utility.accessibility}
          className="utility-access"
        >
          Accessibility
        </span>
        <div className="utility-strip__tools">
          <a className="skip-link" href="#main-content">
            {layoutCopy.skipToMain}
          </a>
          <FontSizeControls />
          <ThemeToggle />
          <button className="isl-unavailable" disabled type="button">
            <span>{shellCopy.loggedOut.utility.isl}</span>
            <small>{shellCopy.loggedOut.utility.islNote}</small>
          </button>
          <span className="utility-strip__divider" aria-hidden="true" />
          <LangSwitch />
        </div>
      </div>
    </div>
  );
}
