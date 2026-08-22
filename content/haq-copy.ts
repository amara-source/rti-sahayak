export const haqCopy = {
  profile: {
    eyebrow: "Haq",
    heading: "Tell us about your household",
    description:
      "Only questions used by the entitlement rules appear here. Every answer is self-declared.",
    browserNote:
      "This prototype stores your answers in this browser only.",
    progress: (current: number, total: number) =>
      `Question ${current} of ${total}`,
    skip: "Skip this question",
    continue: "Continue",
    finish: "See what may apply",
    error: "We could not save these answers. Try again.",
    preferNot: "Prefer not to say",
    question: {
      name: "What name should we use for this synthetic profile?",
      aadhaarLast4:
        "What are the last four digits of the synthetic Aadhaar number?",
      dob: "What is your date of birth?",
      gender: "How do you describe your gender?",
      currentState: "Which state or union territory do you live in now?",
      currentDistrict: "Which district do you live in now?",
      homeState: "Which state or union territory is your home state?",
      homeDistrict: "Which district is your home district?",
      incomeBand: "Which household income band do you declare?",
      employment: "What is your employment type?",
      marital: "What is your marital status?",
      isSingleParent: "Are you a single parent?",
      childrenAges: "How old are the children in your household?",
      parentsAges: "How old are your parents?",
      category: "Which category do you declare?",
      hasDisability: "Do you declare a disability?",
      housing: "What type of housing do you live in?",
    },
    controls: {
      addChild: "Add another child",
      addParent: "Add another parent",
      remove: "Remove",
      noChildren: "No children in the household",
      noParents: "No parents to add",
      age: "Age",
    },
    options: {
      gender: [
        { label: "Woman", value: "F" },
        { label: "Prefer not to say", value: "NA" },
        { label: "Man", value: "M" },
        { label: "Another gender", value: "O" },
      ],
      category: [
        { label: "General", value: "general" },
        { label: "Other Backward Class", value: "obc" },
        { label: "Prefer not to say", value: "NA" },
        { label: "Scheduled Caste", value: "sc" },
        { label: "Scheduled Tribe", value: "st" },
        { label: "Economically Weaker Section", value: "ews" },
      ],
      incomeBand: [
        { label: "Below 1 lakh", value: "<1L" },
        { label: "1 to 3 lakh", value: "1-3L" },
        { label: "Prefer not to say", value: "NA" },
        { label: "3 to 5 lakh", value: "3-5L" },
        { label: "5 to 8 lakh", value: "5-8L" },
        { label: "Above 8 lakh", value: "8L+" },
      ],
      disability: [
        { label: "Yes", value: "yes" },
        { label: "Prefer not to say", value: "NA" },
        { label: "No", value: "no" },
      ],
      employment: [
        { label: "Salaried", value: "salaried" },
        { label: "Gig work", value: "gig" },
        { label: "Self-employed", value: "self" },
        { label: "Unorganised work", value: "unorganised" },
        { label: "Student", value: "student" },
        { label: "Not employed", value: "none" },
      ],
      marital: [
        { label: "Single", value: "single" },
        { label: "Married", value: "married" },
        { label: "Prefer not to say", value: "NA" },
        { label: "Widowed", value: "widowed" },
        { label: "Separated", value: "separated" },
      ],
      yesNo: [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" },
      ],
      housing: [
        { label: "Own home", value: "own" },
        { label: "Registered rental", value: "rent-registered" },
        { label: "Stamp-paper rental", value: "rent-stamp" },
        { label: "Employer housing", value: "employer" },
        { label: "With family", value: "family" },
      ],
    },
  },
  results: {
    eyebrow: "Haq results",
    heading: "What may apply to you",
    description:
      "These are possible matches from the facts you chose to share. The rules decide what appears; this prototype does not decide whether you qualify.",
    section: {
      overdue: "This should already have happened",
      available: "You may be entitled to this",
      upcoming: "Coming up for you",
    },
    empty: "No items in this section from the answers you shared.",
    cardFrame: "You may be entitled to this",
    why: "Why this appears",
    rule: "What the rule says",
    gives: "What it gives",
    how: "How to get it",
    authority: "Authority",
    hidden: (count: number, fields: number) =>
      `${count} more may apply. Answer ${fields} more ${fields === 1 ? "question" : "questions"} to see them.`,
    edit: "Edit your answers",
  },
  api: {
    invalid: "The request is not valid.",
  },
  facts: {
    gender: {
      F: "You told us you are a woman.",
      M: "You told us you are a man.",
      O: "You told us you use another description for your gender.",
    },
    category: {
      general: "You told us you selected General.",
      obc: "You told us you selected Other Backward Class.",
      sc: "You told us you selected Scheduled Caste.",
      st: "You told us you selected Scheduled Tribe.",
      ews: "You told us you selected Economically Weaker Section.",
    },
    childrenOne: (age: number) =>
      `You told us there is a child aged ${age} in your household.`,
    childrenMany: (ages: string) =>
      `You told us there are children aged ${ages} in your household.`,
  },
} as const;
