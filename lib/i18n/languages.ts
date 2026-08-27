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

/**
 * The other languages of the Eighth Schedule, in their own scripts.
 *
 * None of these is built. They are listed rather than hidden because the gap
 * is the honest thing to show: an RTI applicant in Odisha or Assam has the
 * same right and no interface in their language. Listing them names the work
 * that is missing instead of pretending the prototype is finished.
 */
export interface UnbuiltLanguage {
  /** BCP 47 tag, used only for the lang attribute. */
  tag: string;
  label: string;
  english: string;
}

export const unbuiltLanguages: UnbuiltLanguage[] = [
  { tag: "as", label: "অসমীয়া", english: "Assamese" },
  { tag: "bn", label: "বাংলা", english: "Bengali" },
  { tag: "gu", label: "ગુજરાતી", english: "Gujarati" },
  { tag: "kok", label: "कोंकणी", english: "Konkani" },
  { tag: "ks", label: "کٲشُر", english: "Kashmiri" },
  { tag: "mai", label: "मैथिली", english: "Maithili" },
  { tag: "ml", label: "മലയാളം", english: "Malayalam" },
  { tag: "mni", label: "ꯃꯤꯇꯩꯂꯣꯟ", english: "Manipuri" },
  { tag: "mr", label: "मराठी", english: "Marathi" },
  { tag: "ne", label: "नेपाली", english: "Nepali" },
  { tag: "or", label: "ଓଡ଼ିଆ", english: "Odia" },
  { tag: "pa", label: "ਪੰਜਾਬੀ", english: "Punjabi" },
  { tag: "sa", label: "संस्कृतम्", english: "Sanskrit" },
  { tag: "sat", label: "ᱥᱟᱱᱛᱟᱲᱤ", english: "Santali" },
  { tag: "sd", label: "سنڌي", english: "Sindhi" },
  { tag: "ta", label: "தமிழ்", english: "Tamil" },
  { tag: "te", label: "తెలుగు", english: "Telugu" },
  { tag: "ur", label: "اردو", english: "Urdu" },
];

export const STORAGE_KEY = "rti-sahayak-language";
