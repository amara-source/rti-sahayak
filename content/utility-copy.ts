export interface UtilityCardCopy {
  /** Optional. Cards that identify a thing get an icon; list items do not. */
  icon?: string;
  title: string;
  body: string;
  href?: string;
  linkLabel?: string;
  detail?: string;
  featured?: boolean;
}

export interface UtilitySectionCopy {
  heading: string;
  intro?: string;
  cards: UtilityCardCopy[];
}

export interface UtilityPageCopy {
  eyebrow: string;
  heading: string;
  intro: string;
  illustration: string;
  tone: "blue" | "teal" | "orange" | "violet";
  sections: UtilitySectionCopy[];
}

// The Right to Information Act 2005 as amended, published by the Department of
// Personnel and Training. India Code has no stable per-section URL for this Act,
// so every section card opens the full text and names the section to look for.
const actPdf =
  "https://rti.gov.in/Writereaddata/RTI%20Act,%202005%20(Amended)-English%20Version.PDF";

function actLink(section: string) {
  return { href: actPdf, linkLabel: `Official text, ${section}` };
}

export const utilityPages = {
  home: {
    eyebrow: "Right to Information, made usable",
    heading: "File correctly. See the clock. Know what opens next.",
    intro: "RTI Sahayak turns one government form into a guided case, from choosing the right authority to appealing when silence becomes a refusal.",
    illustration: "/illustrations/tracker.png",
    tone: "blue",
    sections: [
      {
        heading: "One continuous journey",
        cards: [
          { icon: "route", title: "See the day 31 example", body: "See a finished case in thirty seconds. No typing. First Appeal is ready.", href: "/example", linkLabel: "Open example case", featured: true },
          { icon: "form", title: "File an RTI", body: "Describe the records, choose the authority and check the request.", href: "/file", linkLabel: "Start a request" },
          { icon: "timeline", title: "Track your case", body: "Keep the reply deadline visible and see what opens next.", href: "/case", linkLabel: "Open your case" },
          { icon: "book", title: "Understand the law", body: "Read the sections behind each warning, clock and appeal.", href: "/act", linkLabel: "The RTI Act" },
        ],
      },
    ],
  },
  about: {
    eyebrow: "About RTI Sahayak",
    heading: "The legal right, with a guide beside you",
    intro: "RTI Sahayak is a concept prototype that helps a citizen file a Right to Information request correctly and track the legal clock afterwards.",
    illustration: "/illustrations/describe.png",
    tone: "blue",
    sections: [
      {
        heading: "Why it exists",
        cards: [
          {
            title: "A simple right became a paid service",
            body: "The RTI Act gives every citizen a ten rupee right to ask for public records. A paid industry has grown up charging hundreds to use it because the government's own portal takes a form and a payment, but does not guide the citizen through the legal process.",
          },
          {
            title: "The clock should not be hidden",
            body: "Filing is only the beginning. RTI Sahayak keeps the reply period, deemed refusal, First Appeal and Second Appeal visible as one continuous case.",
          },
          {
            title: "A prototype, not an authority",
            body: "This is not an official product, is not affiliated with the Government of India and is not connected to any live government system.",
          },
        ],
      },
      {
        heading: "The two websites citizens need",
        intro: "The government separates explanation and filing across two different sites.",
        cards: [
          {
            title: "rti.gov.in",
            body: "The RTI Portal Gateway explains the Act and holds the directory of Public Information Officers and Appellate Authorities.",
            href: "https://rti.gov.in/",
            linkLabel: "Open the RTI Portal Gateway",
          },
          {
            title: "rtionline.gov.in",
            body: "RTI Online is where central government applications are filed and paid for, and where their status and legal clock are tracked.",
            href: "https://rtionline.gov.in/",
            linkLabel: "Open RTI Online",
          },
        ],
      },
    ],
  },
  act: {
    eyebrow: "The RTI Act 2005",
    heading: "The law behind every step",
    intro: "Every deadline, warning and escalation in this prototype comes from an authored rule tied to the Right to Information Act 2005.",
    illustration: "/illustrations/checks.png",
    tone: "violet",
    sections: [
      {
        heading: "Sections used by RTI Sahayak",
        intro: "The government publishes the Act as a single PDF with no link to an individual section, so each card below opens the full text and tells you which section to look for. The version linked is the Act as amended, published by the Department of Personnel and Training.",
        cards: [
          { title: "Sections 2(f) and 2(j)", body: "Information means material already held as records, documents, memos, file notings, reports and other recorded forms. We use this when rewriting a question as a request for records.", ...actLink("Sections 2(f) and 2(j)") },
          { title: "Section 5", body: "Every public authority must appoint Public Information Officers. We use this when proposing the officer title and authority for the request.", ...actLink("Section 5") },
          { title: "Section 6(2)", body: "A citizen does not need to give a reason for asking, or provide personal details beyond what is needed for contact. We use this in the identity-document warning.", ...actLink("Section 6(2)") },
          { title: "Section 6(3)", body: "A request sent to the wrong public authority should be transferred to the correct authority within five days. We use this for the transfer branch and its clock.", ...actLink("Section 6(3)") },
          { title: "Section 7(1)", body: "The Public Information Officer normally has thirty days to reply. A life or liberty request has a forty eight hour period. We use this for the main reply clock.", ...actLink("Section 7(1)") },
          { title: "Section 7(3)", body: "If the authority asks for an additional fee to supply records, it must give the calculation and the reply clock pauses until payment. We show this as a clock warning.", ...actLink("Section 7(3)") },
          { title: "Section 7(2)", body: "Silence after the reply period is a deemed refusal. We use this event to unlock the First Appeal without waiting for a rejection letter.", ...actLink("Section 7(2)") },
          { title: "Section 8", body: "The Act contains exemptions for protected information. A refusal should identify the exemption used; the citizen can challenge how it was applied.", ...actLink("Section 8") },
          { title: "Section 11", body: "Where requested records concern a third party, that party is notified and the decision period may extend to forty days. We explain this exception beside the reply clock.", ...actLink("Section 11") },
          { title: "Section 18", body: "A complaint challenges the officer's conduct and has no time limit. We keep it as a parallel route directly from the original request.", ...actLink("Section 18") },
          { title: "Sections 19(1) and 19(6)", body: "A First Appeal is normally filed within thirty days. The Appellate Authority must decide within thirty days, extendable to forty five days with recorded reasons. We use both clocks in the First Appeal journey.", ...actLink("Sections 19(1) and 19(6)") },
          { title: "Section 19(3)", body: "A Second Appeal goes to the Information Commission within ninety days. We unlock it only after the First Appeal is complete.", ...actLink("Section 19(3)") },
        ],
      },
    ],
  },
  faq: {
    eyebrow: "Help",
    heading: "Ten questions people ask before filing",
    intro: "Short answers to the points that most often stop a citizen from using the RTI Act.",
    illustration: "/illustrations/authority.png",
    tone: "teal",
    sections: [
      {
        heading: "Frequently asked questions",
        cards: [
          { title: "What does it cost?", body: "The central application fee is ten rupees. Filing is free for a person below the poverty line when the required state-issued BPL certificate is attached." },
          { title: "Do I have to say why I want it?", body: "No. Section 6(2) says you do not have to give a reason for asking for information." },
          { title: "Can they refuse?", body: "Yes, where an exemption in Section 8 or another lawful restriction applies. The reply should state the reason, the appeal period and the Appellate Authority." },
          { title: "What if they ignore me?", body: "When the reply period lapses, silence becomes a deemed refusal under Section 7(2). You can file a First Appeal without a rejection letter." },
          { title: "What is the difference between an appeal and a complaint?", body: "An appeal challenges the decision or the lack of one. A Section 18 complaint challenges the officer's conduct, such as refusing to accept an application or demanding a reason." },
          { title: "Can I file about a state government department?", body: "Yes, but not through the central RTI Online portal. Use the state's own RTI route or file on paper with the state public authority." },
          { title: "What if I put it in the wrong office?", body: "Section 6(3) says it should be transferred to the correct authority within five days and you should be told. A correct address is still safer because transfers cost time and are not guaranteed in practice." },
          { title: "Do I need to attach my Aadhaar?", body: "No. Do not attach Aadhaar, PAN or another identity document. The portal only needs a BPL certificate when free filing is claimed." },
          { title: "What if I paid and got no registration number?", body: "Wait 24 to 48 working hours and do not pay again. If the number still does not appear, contact the RTI Online helpdesk with the transaction details." },
          { title: "Can someone charge me to file this?", body: "A private service can charge for its assistance, but you do not need one to exercise the right. The statutory central application fee remains ten rupees, or free with a valid BPL certificate." },
        ],
      },
    ],
  },
  contact: {
    eyebrow: "Contact",
    heading: "Help with the real RTI Online portal",
    intro: "The government RTI Online helpdesk handles technical questions about a real central-government application. RTI Sahayak cannot access or fix a live case.",
    illustration: "/illustrations/authority.png",
    tone: "orange",
    sections: [
      {
        heading: "Government helpdesk",
        cards: [
          { title: "011-24010690", body: "RTI Online helpdesk number.", href: "tel:+911124010690", linkLabel: "Call 011-24010690" },
          { title: "011-24010691", body: "RTI Online helpdesk number.", href: "tel:+911124010691", linkLabel: "Call 011-24010691" },
          { title: "Office hours", body: "9:00 AM to 5:30 PM, Monday to Friday, except public holidays. Call waiting is common." },
        ],
      },
      {
        heading: "Whose helpdesk is this?",
        cards: [
          { title: "Government service, not ours", body: "These numbers belong to the government's RTI Online helpdesk. This prototype has no call centre and cannot see, change or follow up a real application." },
        ],
      },
    ],
  },
  privacy: {
    eyebrow: "Privacy",
    heading: "Stored in your browser, not in an account",
    intro: "This prototype stores one case in a browser cookie so the tracker can work after navigation. It does not create an account or a server-side personal-data record.",
    illustration: "/illustrations/checks.png",
    tone: "teal",
    sections: [
      {
        heading: "What happens to your data",
        cards: [
          { title: "Browser-only case storage", body: "Your answers, draft, simulated registration number and simulated case status are stored in this browser for seven days. They do not sync to another device." },
          { title: "Transient writing assistance", body: "If a model key is configured, the request text and chosen authority are processed server-side only to extract or rewrite text. RTI Sahayak does not store that model request." },
          { title: "No government transmission", body: "Nothing is submitted to RTI Online, a payment gateway, a department, an Information Commission or any other government system." },
        ],
      },
    ],
  },
  terms: {
    eyebrow: "Terms",
    heading: "A prototype, not legal advice",
    intro: "RTI Sahayak demonstrates a different way to guide a citizen through public information requests.",
    illustration: "/illustrations/draft.png",
    tone: "violet",
    sections: [
      {
        heading: "Use of this prototype",
        cards: [
          { title: "No legal advice", body: "The explanations are educational and are not a substitute for advice about a particular legal matter." },
          { title: "No guarantee", body: "A correct application can still be transferred, refused, delayed or answered incompletely. The prototype cannot guarantee an outcome." },
          { title: "No live filing", body: "OTP, payment, registration, department events and appeal submissions shown here are simulations. Use the official portal for a real application." },
        ],
      },
    ],
  },
  rejections: {
    eyebrow: "Before filing",
    heading: "Why applications get rejected",
    intro: "Most failures are avoidable. These checks are taken from the authored pre-flight rules used by this prototype.",
    illustration: "/illustrations/checks.png",
    tone: "orange",
    sections: [
      {
        heading: "Common failure points",
        cards: [
          { icon: "map-pin", title: "Wrong government", body: "The central portal returns state-government matters. Identify whether the records belong to a central or state body before filing." },
          { icon: "text-length", title: "Too much text", body: "The online request field accepts up to 3,000 characters. Put necessary supporting detail into one PDF attachment under 1 MB." },
          { icon: "keyboard", title: "Unsupported characters", body: "Rupee signs, curly quotes and long dash characters can break the form. Use plain characters in the request text." },
          { icon: "split", title: "Several subjects together", body: "Keep one application to one subject and one public authority. Split unrelated requests before filing." },
          { icon: "folder", title: "Asking for reasons", body: "Ask for the record, such as file notings or an order, instead of asking an officer to explain why something happened." },
          { icon: "id-off", title: "Identity documents", body: "Do not attach Aadhaar, PAN or another identity document. Identity proof is not required for an RTI application." },
          { icon: "paperclip", title: "Attachment problems", body: "Use one PDF under 1 MB with a filename that contains no spaces." },
          { icon: "certificate", title: "Missing BPL certificate", body: "A person claiming free filing must attach the certificate issued by the appropriate state government." },
        ],
      },
    ],
  },
  accessibility: {
    eyebrow: "Accessibility",
    heading: "Designed to remain usable",
    intro: "RTI Sahayak uses semantic pages, keyboard-reachable controls and persistent reading preferences across the prototype.",
    illustration: "/illustrations/describe.png",
    tone: "blue",
    sections: [
      {
        heading: "Available controls",
        cards: [
          { title: "Text size", body: "The A minus, A and A plus controls change the base text size and keep the selection across pages." },
          { title: "Colour and contrast", body: "Light mode is the default. Dark mode and four accent colours are available through the utility controls." },
          { title: "Keyboard and screen readers", body: "Navigation, form choices and status actions use native links, buttons, labels and headings. The process map includes an accessible title and description." },
          { title: "Reduced motion and print", body: "The current-step pulse respects reduced-motion preferences. Core content remains legible when printed and on narrow screens." },
        ],
      },
    ],
  },
} satisfies Record<string, UtilityPageCopy>;

export const manualCopy = {
  eyebrow: "User manual",
  heading: "From a problem to a tracked case",
  intro: "Follow the complete prototype journey. Each image is captured from the working screen it describes.",
  steps: [
    { title: "1. Describe the request", body: "Write what happened in your own words, or start from a template. Confirm the plain-language reading before continuing.", image: "/manual/01-describe.jpg", alt: "Describe an RTI request screen" , icon: "describe" },
    { title: "2. Check jurisdiction", body: "Choose central or state government. The central portal cannot accept a state matter, so this gate runs before the rest of the journey.", image: "/manual/02-jurisdiction.jpg", alt: "Jurisdiction gate screen" , icon: "jurisdiction" },
    { title: "3. Choose the authority", body: "Review the proposed public authority and officer title. Change either if the directory points somewhere else.", image: "/manual/03-authority.jpg", alt: "Public authority selection screen" , icon: "authority" },
    { title: "4. Review the rewrite", body: "Compare the original wording with the records-focused draft. The filed version stays editable and the changes are explained.", image: "/manual/04-draft.jpg", alt: "Side-by-side RTI draft screen" , icon: "draft" },
    { title: "5. Run pre-flight checks", body: "Resolve every blocking item. Warnings show both the likely consequence and the specific fix.", image: "/manual/05-checks.jpg", alt: "RTI pre-flight checks screen" , icon: "checks" },
    { title: "6. Practice submission", body: "Use the labelled simulated OTP, fee and registration steps. No real email, payment gateway or government portal is contacted.", image: "/manual/06-submit.jpg", alt: "Simulated RTI submission screen" , icon: "submit" },
    { title: "7. Track the legal clock", body: "The case page shows time remaining, the live statutory process map and the next route that unlocks when a deadline lapses.", image: "/manual/07-case.jpg", alt: "RTI case tracker and live process map" , icon: "track" },
  ],
} as const;
