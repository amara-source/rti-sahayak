export const landingCopy = {
  hero: {
    headline: "One App, Many Government Services",
    description:
      "UMANG brings services from central and state government bodies into one place. Tell us what has happened, or who you are, and we will show you which of them apply to you.",
  },
  search: {
    placeholder: "Search for a service, department or scheme",
    button: "Search",
    noResults: "No matching event, category or service was found.",
    enterSearch: "Enter a service, category or life event to search.",
  },
  stats: {
    items: [
      { value: "2,575", label: "Services on UMANG" },
      { value: "880", label: "From central government" },
      { value: "1,695", label: "From state governments" },
      { value: "All", label: "States and union territories" },
    ],
    caption: "As reported to the Rajya Sabha on 7 August 2026.",
  },
  lifeEvents: {
    heading: "Life Events",
    description:
      "Some things in life need many services at once, from many government bodies, in a particular order. Tell us what has happened and UMANG will bring the right services together for you.",
    explore: "Explore more life events",
    mappedMarker: "Mapped from public sources, not individually verified.",
  },
  categories: {
    heading: "Categories",
    description:
      "UMANG has innumerable services offered by many government bodies and organisations. To ease the job of finding services relevant for you, we have categorised these state and central government bodies into different groups such as Students, Health and others.",
    explore: "Explore 9 more categories",
    items: [
      {
        id: "farmers",
        label: "Farmers",
        description: "Agriculture, crop and rural service listings.",
        icon: "place",
      },
      {
        id: "social-security-pensioners",
        label: "Social Security & Pensioners",
        description: "Pension, provident fund and social security services.",
        icon: "family",
      },
      {
        id: "education-skills-employment",
        label: "Education, Skills & Employment",
        description: "Scholarships, institutions, skills and employment services.",
        icon: "education",
      },
      {
        id: "women-child-senior-citizens",
        label: "Women, Child & Senior Citizens",
        description: "Service listings for women, children and older citizens.",
        icon: "family",
      },
      {
        id: "youth-skills-employment",
        label: "Youth, Skills and Employment",
        description: "Youth programmes, training and work-related services.",
        icon: "work",
      },
      {
        id: "bfsi",
        label: "BFSI",
        description: "Banking, financial services and insurance listings.",
        icon: "money",
      },
      { id: "e-district-services", label: "e-District Services", description: "District certificates and citizen service listings.", icon: "identity" },
      { id: "health-wellness", label: "Health & Wellness", description: "Government health, vaccination and wellness services.", icon: "health" },
      { id: "mera-ration", label: "Mera Ration", description: "Ration card details and portability services.", icon: "ration" },
      { id: "police-legal", label: "Police and Legal", description: "Police citizen services and court-related listings.", icon: "legal" },
      { id: "public-grievance", label: "Public Grievance", description: "Public grievance and complaint service listings.", icon: "legal" },
      { id: "transport", label: "Transport", description: "Vehicle, licence and transport services.", icon: "transport" },
      { id: "travel", label: "Travel", description: "Railways, metro, highways and travel services.", icon: "travel" },
      { id: "utility-bill-payments", label: "Utility & Bill Payments", description: "Utility accounts and bill payment service listings.", icon: "money" },
      { id: "general", label: "General", description: "General citizen services across public bodies.", icon: "identity" },
    ],
  },
  haq: {
    heading: "Haq, what you are entitled to",
    line:
      "Nobody ever sat you down and told you what you can claim. Answer a few questions and find out.",
    button: "Start",
  },
} as const;
