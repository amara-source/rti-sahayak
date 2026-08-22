# AGENTS.md

## Hard constraints — never violate
1. NEVER call, scrape or submit to any live government system.
2. NEVER use real Aadhaar, PAN, OTP or payment data. Generated Aadhaar
   numbers MUST fail the Verhoeff checksum. Write a test asserting this.
3. NEVER clone a government login page. Simulated destinations live
   inside our own site with a visible mock banner.
4. Eligibility, deadlines and legal consequences are decided by the
   DETERMINISTIC RULE ENGINE ONLY. The language model reads, writes and
   translates. It never decides who qualifies for anything.
5. Sensitive attributes — category, disability, income, gender — are
   SELF-DECLARED ONLY. Never inferred from any other field.
6. Output says "you may be entitled to", never "you are entitled to".
7. Every node and entitlement carries sourceUrl, confidence and
   verifiedOn. confidence:"unverified" never renders in Tier 1.
8. Health content is signposting only. Never diagnose or advise.
9. NO RUPEE FIGURE ANYWHERE ON SCREEN. Fees conflict across all sources.
10. Name only statutory bodies and national helplines. Never a named NGO.

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
