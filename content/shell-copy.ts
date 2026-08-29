export const shellCopy = {
  loggedOut: {
    utility: {
      accessibility: "Accessibility tools",
      accessibilityLabel: "Accessibility",
      isl: "English",
      islNote: "Additional languages are not built in this prototype",
    },
    nav: [
      { label: "Home", href: "/" },
      { label: "File an RTI", href: "/file" },
      { label: "Your case", href: "/case" },
      { label: "The Act", href: "/act" },
      { label: "Help", href: "/faq" },
      { label: "Honesty", href: "/honesty" },
    ],
    search: "Search",
    login: "Start a request",
  },
  loggedIn: {
    menu: "Open navigation",
    searchLabel: "Search your case",
    searchNames: ["Application", "Reply", "First Appeal", "Second Appeal"],
    isl: "English",
    islUnavailable: "Additional languages are not built in this prototype.",
    accessibility: "Accessibility tools",
    notifications: "Notifications",
    notificationEmpty: "No new case updates.",
    account: "Open case menu",
    changeProfile: "Return home",
    nav: [
      { label: "Your case", href: "/case" },
      { label: "File an RTI", href: "/file" },
      { label: "The Act", href: "/act" },
      { label: "Help", href: "/faq" },
      { label: "Honesty", href: "/honesty" },
    ],
  },
  personas: [
    { id: "demo", name: "Demo case", initials: "RT", state: "Central", score: 0 },
  ],
  footer: {
    columns: [
      {
        title: "RTI Sahayak",
        links: [
          { label: "File an RTI", href: "/file" },
          { label: "Your case", href: "/case" },
          { label: "About", href: "/about" },
        ],
      },
      {
        title: "Learn",
        links: [
          { label: "The RTI Act", href: "/act" },
          { label: "FAQ", href: "/faq" },
          { label: "Why applications get rejected", href: "/rejections" },
          { label: "User manual", href: "/manual" },
          { label: "Officer directory", href: "/authorities" },
          { label: "Ask from the rule pack", href: "/ask" },
        ],
      },
      {
        title: "Prototype",
        links: [
          { label: "Honesty", href: "/honesty" },
          { label: "Officer preview", href: "/officer" },
          { label: "Privacy", href: "/privacy" },
          { label: "Terms", href: "/terms" },
          { label: "Accessibility", href: "/accessibility" },
        ],
      },
    ],
    contact: {
      title: "Contact",
      numbers: [
        { label: "011-24010690", href: "tel:+911124010690" },
        { label: "011-24010691", href: "tel:+911124010691" },
      ],
      hours: "9:00 AM to 5:30 PM, Monday to Friday, except public holidays",
      follow: "Follow Us",
      socialNote: "This prototype has no social media accounts.",
      socialLabels: ["X", "Facebook", "YouTube"],
    },
    visitors: "Visitors",
    visitorNote: "Prototype counter",
    ownership:
      "Concept prototype for a public-service redesign hackathon. Not affiliated with or endorsed by the Government of India.",
    updated: "Prototype under active development",
  },
  floating: {
    top: "Back to top",
    chat: "Open the chatbot",
    chatHeading: "Chatbot",
    chatBody: "No live helpdesk or government service is connected.",
    close: "Close",
  },
  languagePicker: {
    label: "Language",
    more: "More languages",
    moreNote: "Other languages of the Eighth Schedule. None of these is built in this prototype.",
    notBuilt: "Not built in this prototype",
  },
  theme: {
    light: "Use light theme",
    dark: "Use dark theme",
  },
} as const;
