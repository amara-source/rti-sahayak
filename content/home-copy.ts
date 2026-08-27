/**
 * Home page sections beyond the hero and the journey cards.
 *
 * Every trap below corresponds to an authored check in rules/rti/journey.json.
 * Nothing here introduces a rule, a deadline or a section number that the pack
 * does not already carry.
 */

export interface TrapCopy {
  /** Matches the id of a check or node in the rule pack. */
  ruleId: string;
  ruleKind: "check" | "node";
  title: string;
  front: string;
  back: string;
  basis: string;
}

export const homeCopy = {
  traps: {
    heading: "Nine traps that end applications",
    intro: "Each one is a check this prototype runs before you pay. Select a card to read what goes wrong.",
    linkLabel: "See all the ways applications fail",
    href: "/rejections",
    flipHint: "Select to read more",
    backHint: "Select to turn back",
    items: [
      {
        ruleId: "jurisdiction",
        ruleKind: "check",
        title: "Wrong government",
        front: "File a state matter on the central portal and you lose the fee.",
        back: "The central portal takes only central bodies. Its own homepage warns in red that state applications are returned and the fee is not refunded. Most everyday problems are state matters.",
        basis: "RTI Online portal notice",
      },
      {
        ruleId: "asks_for_records",
        ruleKind: "check",
        title: "Asking for reasons",
        front: "The Act gives you records. It cannot make anyone explain themselves.",
        back: "Information means material already held: files, notings, orders, reports. A question can be refused. Ask for the file notings, not for why it was delayed.",
        basis: "RTI Act 2005, sections 2(f), 2(i) and 2(j)",
      },
      {
        ruleId: "no_identity_docs",
        ruleKind: "check",
        title: "Attaching identity proof",
        front: "You do not have to prove who you are, and you should not try.",
        back: "Section 6(2) requires no identity proof, and you cannot be asked why you want the information. The only document needed is a BPL certificate, and only for free filing.",
        basis: "RTI Act 2005, section 6(2)",
      },
      {
        ruleId: "single_subject",
        ruleKind: "check",
        title: "Several subjects at once",
        front: "One application, one subject, one public authority.",
        back: "Unrelated questions get split, transferred and half answered. Each transfer restarts the clock at the receiving authority, so bundling costs you time as well as answers.",
        basis: "RTI Act 2005, section 6(3)",
      },
      {
        ruleId: "charset",
        ruleKind: "check",
        title: "Characters the form rejects",
        front: "A rupee sign or a curly quote can break the submission.",
        back: "The text field accepts only plain letters, digits and a short list of punctuation. Rupee signs, curly quotes and long dashes are the usual culprits, and the form rarely says why.",
        basis: "RTI Online guidelines",
      },
      {
        ruleId: "bpl_certificate",
        ruleKind: "check",
        title: "Missing BPL certificate",
        front: "Free filing needs the certificate issued by the appropriate government.",
        back: "If you claim free filing without the certificate, the application will not be accepted. Attach it, or use paid filing at the statutory ten rupee fee.",
        basis: "RTI Online guidelines; RTI Rules 2012",
      },
      {
        ruleId: "attachment",
        ruleKind: "check",
        title: "An attachment the portal rejects",
        front: "Use one PDF under 1 MB with no spaces in its filename.",
        back: "An oversized file, the wrong format or a space in the filename can make the upload fail silently.",
        basis: "RTI Online guidelines",
      },
      {
        ruleId: "preflight",
        ruleKind: "node",
        title: "Requesting paper copies",
        front: "Ask for electronic records when they meet your need.",
        back: "The authored pre-flight warning says paper copies add a per-page charge beyond the first set. Electronic records avoid that copying cost.",
        basis: "RTI Online guidelines; RTI Rules 2012",
      },
      {
        ruleId: "second_appeal",
        ruleKind: "node",
        title: "Skipping the First Appeal",
        front: "A Second Appeal does not replace the First Appeal.",
        back: "The authored Second Appeal warning says an appeal filed without a First Appeal is liable to be returned.",
        basis: "RTI Act 2005, section 19(3); RTI Online portal notice",
      },
    ] as TrapCopy[],
  },

  /**
   * The same statutory path as the case map, told as a journey rather than a
   * diagram. Day counts are not written here: they are read from the rule pack
   * at render time so this can never drift from the engine.
   */
  journey: {
    heading: "How it actually goes",
    intro: "One request, and the law that runs after it. This is the whole path, start to finish.",
    linkLabel: "See it on a real case",
    href: "/example",
    footnote: "Every day count above is read from the same rule pack the case tracker uses.",
    stages: [
      {
        id: "ask",
        title: "You ask",
        line: "Ten rupees, and you never have to say why you want it.",
      },
      {
        id: "wait",
        title: "They have to reply",
        line: "The officer must give the records, or refuse with reasons.",
      },
      {
        id: "silence",
        title: "Silence becomes a refusal",
        line: "No reply is a refusal in law. You do not need a rejection letter.",
      },
      {
        id: "first",
        title: "First Appeal",
        line: "Free, and decided by an officer senior to the Public Information Officer.",
      },
      {
        id: "decide",
        title: "The Authority decides",
        line: "Thirty days, extendable to forty five with reasons in writing.",
      },
      {
        id: "second",
        title: "Second Appeal",
        line: "The Information Commission can penalise the officer personally.",
      },
    ],
  },

  /** Its own section, low on the page, above the helpdesk panel. */
  example: {
    eyebrow: "See it working",
    heading: "A real request, start to finish",
    body: "Open a pension request that was filed and never answered. The reply period has run out, the refusal has taken effect in law, and the First Appeal is drafted and ready. Nothing to type.",
    action: "Open the example case",
    href: "/example",
  },

  helpdesk: {
    heading: "Need help with a service?",
    intro: "These are the government's own RTI Online helpdesk numbers. They are not ours, and nobody at these numbers knows anything about this prototype.",
    numbers: ["011-24010690", "011-24010691"],
    hours: "9:00 AM to 5:30 PM, Monday to Friday, except public holidays",
    disclaimer: "RTI Sahayak is a concept prototype and is not affiliated with the Government of India. For anything about a real application, use the numbers above or the portal itself.",
    portalLabel: "Open the filing portal",
    portalHref: "https://rtionline.gov.in/",
  },
} as const;
