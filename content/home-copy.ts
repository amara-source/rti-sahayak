/**
 * Home page sections beyond the hero and the journey cards.
 *
 * Every trap below corresponds to an authored check in rules/rti/journey.json.
 * Nothing here introduces a rule, a deadline or a section number that the pack
 * does not already carry.
 */

export interface TrapCopy {
  /** Matches the id of a check in the rule pack. */
  checkId: string;
  title: string;
  front: string;
  back: string;
  basis: string;
}

export const homeCopy = {
  traps: {
    heading: "Five traps that end applications",
    intro: "Each one is a check this prototype runs before you pay. Select a card to read what goes wrong.",
    linkLabel: "See all the ways applications fail",
    href: "/rejections",
    flipHint: "Select to read more",
    backHint: "Select to turn back",
    items: [
      {
        checkId: "jurisdiction",
        title: "Wrong government",
        front: "File a state matter on the central portal and you lose the fee.",
        back: "The central portal takes only central bodies. Its own homepage warns in red that state applications are returned and the fee is not refunded. Most everyday problems are state matters.",
        basis: "RTI Online portal notice",
      },
      {
        checkId: "asks_for_records",
        title: "Asking for reasons",
        front: "The Act gives you records. It cannot make anyone explain themselves.",
        back: "Information means material already held: files, notings, orders, reports. A question can be refused. Ask for the file notings, not for why it was delayed.",
        basis: "RTI Act 2005, sections 2(f), 2(i) and 2(j)",
      },
      {
        checkId: "no_identity_docs",
        title: "Attaching identity proof",
        front: "You do not have to prove who you are, and you should not try.",
        back: "Section 6(2) requires no identity proof, and you cannot be asked why you want the information. The only document needed is a BPL certificate, and only for free filing.",
        basis: "RTI Act 2005, section 6(2)",
      },
      {
        checkId: "single_subject",
        title: "Several subjects at once",
        front: "One application, one subject, one public authority.",
        back: "Unrelated questions get split, transferred and half answered. Each transfer restarts the clock at the receiving authority, so bundling costs you time as well as answers.",
        basis: "RTI Act 2005, section 6(3)",
      },
      {
        checkId: "charset",
        title: "Characters the form rejects",
        front: "A rupee sign or a curly quote can break the submission.",
        back: "The text field accepts only plain letters, digits and a short list of punctuation. Rupee signs, curly quotes and long dashes are the usual culprits, and the form rarely says why.",
        basis: "RTI Online guidelines",
      },
    ] as TrapCopy[],
  },

  why: {
    heading: "Why this exists",
    cards: [
      {
        title: "The government runs two separate websites",
        body: "rti.gov.in explains the Act and holds the directory of Public Information Officers. rtionline.gov.in is where you file, pay and start the legal clock. Neither site tells you that you need the other one.",
      },
      {
        title: "A ten rupee right became a paid service",
        body: "The application fee set by the RTI Rules 2012 is ten rupees, and nothing for a household below the poverty line. An industry has grown up charging citizens hundreds of rupees to fill in that form for them.",
      },
      {
        title: "Filing is the easy part",
        body: "The reply period, the deemed refusal on silence, the First Appeal and the Second Appeal are where most applications are lost. None of that is visible on the portal after you pay.",
      },
    ],
  },

  helpdesk: {
    heading: "Need help with a service?",
    intro: "These are the government's own RTI Online helpdesk numbers. They are not ours, and nobody at these numbers knows anything about this prototype.",
    numbers: ["011-24010690", "011-24010691"],
    hours: "9:00 AM to 5:30 PM, Monday to Friday, except public holidays",
    disclaimer: "RTI Sahayak is a concept prototype and is not affiliated with the Government of India. For anything about a real application, use the numbers above or the portal itself.",
    portalLabel: "Open rtionline.gov.in",
    portalHref: "https://rtionline.gov.in/",
  },
} as const;
