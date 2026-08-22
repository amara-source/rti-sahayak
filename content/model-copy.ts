export const modelCopy = {
  entry: {
    label: "Use your own words",
    description:
      "The model can read or translate what you write. It never decides what you qualify for.",
    extract: {
      title: "Describe your situation",
      line: "Write one paragraph. You will review every detail before it is used.",
      action: "Describe in your own words",
    },
    translate: {
      title: "Hindi to Kannada form",
      line: "Type details in Hindi and see the same form fill in Kannada.",
      action: "See the translation demo",
    },
  },
  translate: {
    eyebrow: "Language demonstration",
    heading: "Hindi in. Kannada form out.",
    description:
      "Write synthetic details in Hindi. The model translates the words only. It does not select services or decide eligibility.",
    synthetic:
      "Use synthetic details only. Do not enter Aadhaar, PAN, OTP, password or payment information.",
    inputPanel: "Hindi input",
    outputPanel: "Kannada form output",
    fields: {
      current: "वर्तमान राज्य और जिला",
      next: "नया राज्य और जिला",
      situation: "अपनी स्थिति बताइए",
      currentKn: "ಪ್ರಸ್ತುತ ರಾಜ್ಯ ಮತ್ತು ಜಿಲ್ಲೆ",
      nextKn: "ಹೊಸ ರಾಜ್ಯ ಮತ್ತು ಜಿಲ್ಲೆ",
      situationKn: "ನಿಮ್ಮ ಪರಿಸ್ಥಿತಿ",
    },
    action: "Fill the Kannada form",
    pending: "Translating the words",
    empty: "The Kannada translation will appear here.",
    unavailable:
      "Translation is unavailable right now. Your Hindi text is still here, and the rest of the prototype continues to work.",
    back: "Back to Haq",
  },
  extract: {
    eyebrow: "Model-assisted profile",
    heading: "Describe your situation in your own words",
    description:
      "The model reads your words and proposes profile fields. It does not check eligibility or recommend a service.",
    synthetic:
      "Use synthetic details only. Do not enter Aadhaar, PAN, OTP, password or payment information.",
    inputLabel: "What would you like UMANG to understand?",
    placeholder:
      "Example: My date of birth is 2002-06-15, I am a woman, and I have two children aged 4 and 7.",
    action: "Show me what you read",
    pending: "Reading your words",
    reviewEyebrow: "Confirm before anything is used",
    reviewHeading: "Is this what you said?",
    reviewDescription:
      "Correct or remove any detail. The rule engine is not called until you confirm.",
    noFields:
      "We could not find a profile detail to confirm. Revise the description or answer the form instead.",
    remove: "Remove this detail",
    confirm: "Yes, use these details",
    confirming: "Using the confirmed details",
    revise: "Revise the description",
    form: "Answer the form instead",
    unavailable:
      "Model-assisted reading is unavailable right now. You can still answer the form and use every deterministic feature.",
    restricted:
      "Remove government identifiers before continuing. Do not enter Aadhaar or PAN data.",
    saveFailure:
      "We could not use the confirmed details. Answer the form instead.",
    fieldLabel: {
      name: "Name",
      dob: "Date of birth",
      gender: "Gender",
      currentState: "Current state",
      currentDistrict: "Current district",
      homeState: "Home state",
      homeDistrict: "Home district",
      incomeBand: "Household income band",
      employment: "Employment type",
      marital: "Marital status",
      isSingleParent: "Single parent",
      childrenAges: "Children's ages",
      parentsAges: "Parents' ages",
      category: "Category",
      hasDisability: "Disability",
      housing: "Housing type",
    },
  },
  api: {
    invalid: "The request is not valid.",
    unavailable: "Model-assisted features are unavailable right now.",
    restricted: "Remove government identifiers before continuing.",
    unsupported: "Only Hindi to Kannada is available in this prototype.",
  },
} as const;
