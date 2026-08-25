import type { UtilityPageCopy } from "./utility-copy";

export const honestyCopy: UtilityPageCopy = {
  eyebrow: "How this prototype works",
  heading: "Real rules, visible simulations",
  intro: "The boundary is deliberate. Legal rules come from an authored deterministic engine. Demonstration events are labelled and never touch a government system.",
  illustration: "/illustrations/checks.png",
  tone: "orange",
  sections: [
    {
      heading: "Real and deterministic",
      intro: "These parts run from the RTI rule pack, not from a language model.",
      cards: [
        { title: "Rule engine", body: "The engine decides which steps apply, their order, when they lock or unlock, and what happens when a deadline lapses." },
        { title: "Statutory clocks", body: "Section 6(3): transfer within 5 days. Section 7(1): reply within 30 days, or 48 hours for life or liberty. Section 11: up to 40 days for third-party information. Sections 19(1) and 19(6): 30 days to file a First Appeal and up to 45 days for its decision. Section 19(3): 90 days for a Second Appeal. Section 18: no time limit for a complaint." },
        { title: "Jurisdiction logic", body: "Central, state and unknown answers control whether a citizen can continue to the simulated central filing route. Unknown remains a caution until resolved." },
        { title: "Pre-flight checks", body: "Length, character set, one subject, request for records, identity documents, attachment and BPL-certificate rules are evaluated before simulated submission." },
        { title: "Authority directory", body: "The searchable directory contains a small authored set of central public authorities and officer titles. It never names an individual and points to rti.gov.in when nothing matches.", href: "/authorities", linkLabel: "Open the directory" },
        { title: "Sources and dates", body: "Every journey node carries its source label, official source URL and verification date. The RTI journey and authority set are marked verified on 25 August 2026." },
      ],
    },
    {
      heading: "Simulated for the demonstration",
      cards: [
        { title: "Submission", body: "The application is not submitted to RTI Online or any department." },
        { title: "OTP", body: "The displayed OTP is fixed and synthetic. No email is sent." },
        { title: "Payment", body: "The fee screen is a labelled simulation. It has no card fields and no payment gateway." },
        { title: "Registration number", body: "The DOPTR-format registration number is synthetic and does not identify a real application." },
        { title: "Department status", body: "Received, in-progress, approved and rejected updates are simulated events inside the case." },
        { title: "Passage of time", body: "The time-travel control advances a synthetic clock so a reviewer can see deemed refusal and appeals unlock." },
      ],
    },
    {
      heading: "Scripted, not generated",
      cards: [
        { title: "Ask RTI Sahayak", body: "The Ask page offers fixed question chips and returns text already authored in the RTI rule pack. It is not a chatbot and is not connected to a model.", href: "/ask", linkLabel: "Open the scripted assistant" },
      ],
    },
    {
      heading: "The boundary",
      cards: [
        { title: "Synthetic data only", body: "All people, requests, case codes, OTPs, registration numbers and status events shown in this prototype are synthetic." },
        { title: "No live connection", body: "No live government system is contacted. Links to official sources open separately and no government login page is copied or embedded." },
        { title: "Not official", body: "RTI Sahayak is a concept prototype. It is not an official Government of India product and is not affiliated with or endorsed by the Government of India." },
      ],
    },
  ],
};
