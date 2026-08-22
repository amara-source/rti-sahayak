export const landingCopy = {
  hero: {
    headline: "One App, Many Government Services",
    description:
      "UMANG brings services from central and state government bodies into one place. Tell us what has happened, or who you are, and we will show you which of them apply to you.",
  },
  search: {
    placeholder: "Search for a service, department or scheme",
    button: "Search",
    unavailable:
      "Search is not part of this prototype. Use Life Events or Categories below.",
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
        id: "travel",
        label: "Travel",
        description:
          "Railways, metro services, highways and other travel-related services.",
        icon: "travel",
      },
      {
        id: "health-wellness",
        label: "Health and Wellness",
        description:
          "Government health schemes, vaccination and other health services.",
        icon: "health",
      },
      {
        id: "police-legal",
        label: "Police and Legal",
        description:
          "Reporting cases with the police, and services relating to the courts.",
        icon: "legal",
      },
      {
        id: "mera-ration",
        label: "Mera Ration",
        description:
          "Ration card details and services relating to your ration card.",
        icon: "ration",
      },
      {
        id: "transport",
        label: "Transport",
        description: "Vehicle, licence and other transport services.",
        icon: "transport",
      },
      {
        id: "education-skills-employment",
        label: "Education, Skills and Employment",
        description:
          "Scholarships, accredited institutions and employment services.",
        icon: "education",
      },
    ],
  },
  haq: {
    heading: "Haq — what you are entitled to",
    line:
      "Nobody ever sat you down and told you what you can claim. Answer a few questions and find out.",
    button: "Start",
  },
} as const;
