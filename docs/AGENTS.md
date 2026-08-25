# AGENTS.md

## Hard constraints
1. NEVER submit to, or interact with, rtionline.gov.in or any live government system.
2. NEVER clone a government login page. Simulated OTP and payment screens are
   visibly ours and labelled.
3. NEVER use real Aadhaar or PAN data. Synthetic only.
4. Deadlines, jurisdiction, eligibility and legal consequences come from the
   DETERMINISTIC RULE ENGINE ONLY. The model reads and writes. It never decides.
5. Rule content lives in /rules. NEVER invent a node, a deadline, a section
   number or an authority. If something is missing, STOP AND ASK.
6. Every node carries sourceUrl, confidence and verifiedOn. Nothing with
   confidence "unverified" renders as fact.
7. No rupee figure for any fee except the statutory ₹10 application fee and
   the ₹2 per page copying charge, both of which are set in the RTI Rules 2012.
8. Every simulated step is labelled once, clearly. Not on every row.
9. No em dashes anywhere in user-facing copy.
10. Not an official Government of India product. Non-dismissible strip on every page.

## Working method
- Rule content lives in /rules as JSON. NEVER invent rule content.
  If a node is missing, STOP AND ASK. Do not fill the gap.
- Engines are pure functions. No network, DB or model calls inside them.
- Write the tests before the implementation for both engines.

## Copy
- Sentence case. Short sentences. Present tense. Second person.
- No emoji, no exclamation marks, no "Let's get started".
- Never make the user re-explain their situation.
- Every string lives in docs/COPY.md, not inline in components.
- Every screen must be legible printed on A4.

## Performance
Server-render the critical path. Must remain usable on a low-end Android
over a slow connection. No fixed bundle budget — measure and report, don't
optimise prematurely.
