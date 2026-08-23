export const marketingCopy = {
  hero: {
    label: "Featured",
    previous: "Previous feature",
    next: "Next feature",
    select: (index: number) => `Show feature ${index + 1}`,
    slides: [
      {
        eyebrow: "Life Events",
        title: "Start with what happened, not a department name",
        body: "Get one ordered plan across the services involved in a move, a job loss or a death in the family.",
        action: "Build a moving plan",
        href: "/events/moving-state",
        tone: "blue",
      },
      {
        eyebrow: "Haq",
        title: "Eligibility is not an answer",
        body: "Turn a broad scheme match into a short list with a reason, a date and the next concrete action.",
        action: "See your list",
        href: "/haq",
        tone: "orange",
      },
      {
        eyebrow: "One App, Many Government Services",
        title: "Find the service without knowing who owns it",
        body: "Search events, categories and service names from one place.",
        action: "Explore services",
        href: "/services",
        tone: "teal",
      },
    ],
  },
  stats: {
    items: [
      {
        label: "Departments/Entities",
        values: [
          { name: "Central", value: "80" },
          { name: "State", value: "162" },
        ],
      },
      {
        label: "Services",
        values: [
          { name: "Central", value: "880" },
          { name: "State", value: "1,705" },
        ],
      },
      {
        label: "Registrations",
        values: [{ name: "Total", value: "12.15 Crores" }],
      },
      {
        label: "Transactions",
        values: [{ name: "Total", value: "803.79 Crores" }],
      },
    ],
    caption: "As shown on web.umang.gov.in, August 2026.",
  },
  newServices: {
    heading: "What's New",
    subline: "Citizens may explore recently added service areas.",
    promoTitle: "Weather alerts",
    promoBody: "See the shape of an alert service without contacting a live system.",
    promoAction: "View prototype note",
    items: [
      "Pension passbook",
      "Student services",
      "Ration portability",
      "Citizen certificates",
      "Employment services",
      "Transport services",
    ],
  },
  popular: {
    heading: "Popular Services",
    subline: "Common starting points across the public-service catalogue.",
    items: ["EPFO services", "Aadhaar services", "DigiLocker", "Rail journey services"],
  },
  trending: {
    heading: "Trending",
    subline: "Services people are exploring in this prototype.",
    items: [
      "Income certificate",
      "Pension services",
      "Scholarship services",
      "Ration card details",
      "Vehicle services",
      "Public grievance",
    ],
  },
  carousel: {
    previous: "Previous cards",
    next: "Next cards",
    select: (index: number) => `Show card set ${index + 1}`,
  },
  states: {
    heading: "Services by States",
    description:
      "Browse service areas connected to state and union territory administrations.",
    action: "Explore 30+ States",
    states: ["Delhi", "Haryana", "Gujarat", "Maharashtra"],
  },
  lifeEvents: {
    heading: "Life Events",
    description:
      "Tell us what happened. We bring the relevant services together in dependency order and keep every existing category available below.",
    guided: "Guided plan",
  },
  categories: {
    heading: "Categories",
    description:
      "Browse the same service catalogue by category. Life Events adds another door and removes nothing.",
    action: "Explore 9 more categories",
  },
  haq: {
    eyebrow: "Haq",
    heading: "A match is only the beginning",
    body: "See which verified items matter now, what should already have happened and what is coming up.",
    action: "Build your list",
  },
  help: {
    heading: "Need help with a service?",
    body: "We are available all days of the week from 10 am to 6 pm.",
    number: "10505",
    illustration: "Support preview",
  },
  access: {
    heading: "Multiple Ways to Access",
    qr: "Scan QR Code to Download the App",
    note: "This prototype is web-only. Store and WhatsApp buttons show the intended access points without opening an integration.",
    options: ["Play Store", "App Store", "Gov.in AppStore", "WhatsApp +91 95828 10505"],
    follow: "Follow us",
    social: ["Facebook", "LinkedIn", "YouTube", "Instagram", "X"],
    selected: (label: string) => `${label} is not connected in this prototype.`,
  },
  lazy: {
    loading: "Loading this section",
  },
} as const;
