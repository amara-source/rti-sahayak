export const layoutCopy = {
  disclaimer:
    "Concept prototype for a hackathon. Not an official Government of India product. All data is synthetic. No live government system is contacted.",
  skipToMain: "Skip to main content",
  textSizes: ["A-", "A", "A+"] as const,
  textSizeLabel: "Text size",
  wordmark: "UMANG",
  tagline: "One App, Many Government Services",
  navigation: [
    { label: "Home", href: "/" },
    { label: "Life Events", href: "/events" },
    { label: "Categories", href: "/#categories" },
    { label: "All Services", href: "/services" },
    { label: "About", href: "/honesty" },
  ] as const,
  account: "Try a demo profile",
  languageLabel: "Language",
  languages: [
    { label: "English", value: "en" },
    { label: "हिंदी", value: "hi" },
    { label: "ಕನ್ನಡ", value: "kn" },
  ] as const,
  footerColumns: [
    {
      title: "UMANG",
      links: ["About", "Services", "Categories", "Life Events"],
    },
    {
      title: "Support",
      links: ["Help and FAQ", "Contact", "Feedback"],
    },
    {
      title: "Policies",
      links: ["Terms", "Privacy", "Accessibility", "Disclaimer"],
    },
    {
      title: "Also on",
      links: ["Android", "iOS", "KaiOS"],
    },
  ] as const,
  footerNote:
    "Concept prototype built for a public-service redesign hackathon. Not affiliated with, endorsed by, or representing the Government of India, MeitY, NeGD or UMANG. No government emblem or logo is reproduced. All data shown is synthetic.",
} as const;
