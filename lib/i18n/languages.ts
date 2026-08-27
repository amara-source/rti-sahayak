export type Language = "en" | "hi" | "kn";

export interface LanguageOption {
  code: Language;
  /** Shown in the switcher, in that language's own script. */
  label: string;
  /** False where the translation has not been written yet. */
  built: boolean;
}

export const languages: LanguageOption[] = [
  { code: "en", label: "English", built: true },
  { code: "hi", label: "हिंदी", built: true },
  { code: "kn", label: "ಕನ್ನಡ", built: false },
];

export const STORAGE_KEY = "rti-sahayak-language";
