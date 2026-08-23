export const applicationServicesCopy = {
  eyebrow: "Services",
  heading: "View All Services",
  searchLabel: "Filter services on this page",
  searchPlaceholder: "Search certificates, pensions and student services",
  clear: "Clear filter",
  promo: {
    eyebrow: "Start with the outcome",
    heading: "One life event can involve many services",
    body: "Use an ordered journey when a department-by-department list is not enough.",
    action: "Explore Life Events",
  },
  purposeHeading: "Services grouped by purpose",
  groups: [
    {
      heading: "Certificates",
      services: ["Income Certificate", "Domicile Certificate"],
      categoryId: "e-district-services",
    },
    {
      heading: "Pension",
      services: ["Current Holding", "Calculator & Process", "Passbook", "Life Certificate"],
      categoryId: "social-security-pensioners",
    },
    {
      heading: "Student",
      services: ["Scholarship services", "Accredited institution search", "Anti-ragging support"],
      categoryId: "education-skills-employment",
    },
  ],
  explore: {
    heading: "Explore Services",
    tabs: [
      { id: "popular", label: "Popular", items: ["EPFO services", "Aadhaar services", "Income certificate", "Rail journey services"] },
      { id: "trending", label: "Trending", items: ["Pension services", "Ration portability", "Vehicle services", "Public grievance"] },
      { id: "new", label: "What's New", items: ["Student services", "Employment services", "Citizen certificates", "Health scheme signposting"] },
    ],
  },
  categories: "Categories",
  categoryResult: "Services in this category",
  categoryListing: "Static catalogue listing",
  empty: "No service names match this filter.",
} as const;
