import { layoutCopy } from "@/content/layout-copy";

export function LangSwitch() {
  return (
    <label className="language-switch">
      <span className="sr-only">{layoutCopy.languageLabel}</span>
      <select name="language" defaultValue="en">
        {layoutCopy.languages.map((language) => (
          <option key={language.value} value={language.value}>
            {language.label}
          </option>
        ))}
      </select>
    </label>
  );
}
