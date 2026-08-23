export const dashboardCopy = {
  hero: {
    previous: "Previous dashboard feature",
    next: "Next dashboard feature",
    slides: [
      {
        eyebrow: "Life Events",
        heading: "Moving to another state?",
        body: "Put identity, ration, voter and vehicle tasks into one ordered plan.",
        action: "Build a moving plan",
        href: "/events/moving-state",
        tone: "blue",
      },
      {
        eyebrow: "Haq",
        heading: "Eligibility is only the beginning",
        body: "Turn your declared facts into a short, ordered list with reasons and dates.",
        action: "See your list",
        href: "/haq",
        tone: "orange",
      },
      {
        eyebrow: "Your services",
        heading: "Pick up where you left off",
        body: "Open your recent services, saved documents and plan updates from one place.",
        action: "View services",
        href: "/app/services",
        tone: "teal",
      },
    ],
  },
  highlight: "A clearer route through government services, built around your situation.",
  quick: {
    heading: "Quick Services",
    items: [
      { label: "Health", detail: "Health schemes and vaccination", href: "/app/services?category=health-wellness", tone: "teal" },
      { label: "Emergency", detail: "India's unified emergency response", href: "tel:112", tone: "purple" },
      { label: "Travel", detail: "Rail and other travel services", href: "/app/services?category=travel", tone: "green" },
      { label: "Utility", detail: "Utility accounts and bill services", href: "/app/services?category=utility-bill-payments", tone: "lavender" },
    ],
  },
  recent: {
    heading: "Recently Used Services",
    bookmark: "Save this service",
    bookmarked: "Service saved",
    items: [
      { name: "EPFO services", category: "Social Security & Pensioners", href: "/app/services?category=social-security-pensioners" },
      { name: "Income certificate", category: "e-District Services", href: "/app/services?category=e-district-services" },
      { name: "Rail journey services", category: "Travel", href: "/app/services?category=travel" },
    ],
  },
  documents: {
    heading: "My Documents",
    viewAll: "View All",
    collapse: "Show fewer",
    items: [
      { type: "Aadhaar preview", authority: "Synthetic document" },
      { type: "School certificate", authority: "Demo issuing authority" },
      { type: "Driving licence preview", authority: "Synthetic document" },
      { type: "Pension record preview", authority: "Synthetic document" },
    ],
  },
  helplines: {
    heading: "Essential Helpline Numbers",
    note: "These links dial official helplines. Emergency calls should be made only when help is genuinely needed.",
    source: "Official source",
    items: [
      { label: "Farmers", number: "1800-180-1551", dial: "18001801551", sourceUrl: "https://www.dackkms.gov.in/Account/aboutus.aspx" },
      { label: "Senior Citizen", number: "14567", dial: "14567", sourceUrl: "https://nisd.gov.in/FAQ/FAQ_Elderline.pdf" },
      { label: "Student", number: "1800-180-5522", dial: "18001805522", sourceUrl: "https://ugc.gov.in/" },
      { label: "Women & Child", number: "181 · 1098", dial: "181", sourceUrl: "https://www.spniwcd.wcd.gov.in/help/faqs", secondaryDial: "1098" },
      { label: "Health", number: "112", dial: "112", sourceUrl: "https://112.gov.in/" },
      { label: "Police", number: "112", dial: "112", sourceUrl: "https://112.gov.in/" },
      { label: "Indian Railways", number: "139", dial: "139", sourceUrl: "https://contents.irctc.co.in/en/UserGuideIRCTC.pdf" },
    ],
  },
  profile: {
    eyebrow: "Complete Profile",
    scoreSuffix: "out of 10",
    message: (score: number) => `Your profile is ${score} out of 10. Completing it would show you four more things you can claim.`,
    action: "Complete profile with Haq",
  },
  utilities: {
    aqi: {
      heading: "Air Quality Index",
      value: "72",
      label: "Synthetic sample, moderate",
      note: "No live air-quality service is connected.",
    },
    calculator: {
      heading: "Financial Calculator",
      body: "Preview how a pension or savings calculator could sit beside your services.",
      action: "Open calculator preview",
      close: "Close calculator preview",
      note: "This prototype does not calculate eligibility, benefits, fees or financial advice.",
    },
  },
} as const;
