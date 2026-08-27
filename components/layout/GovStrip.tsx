import { layoutCopy } from "@/content/layout-copy";
import { FontSizeControls } from "@/components/layout/FontSizeControls";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { AccentPicker } from "@/components/layout/AccentPicker";
import { LanguagePicker } from "@/components/layout/LanguagePicker";
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
          <AccentPicker />
          <LanguagePicker />
        </div>
      </div>
    </div>
  );
}
