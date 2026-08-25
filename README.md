# RTI Sahayak

A concept prototype that redesigns the experience of filing a Right to
Information request in India.

**Live:** https://rti-sahayak-three.vercel.app
**Start here:** [/example](https://rti-sahayak-three.vercel.app/example) opens a
fully populated case at day 31, after silence has become a refusal in law.

Not an official Government of India product. Not affiliated with or endorsed by
the Government of India. No live government system is ever contacted.

## The problem

The Right to Information Act 2005 gives every citizen a ten rupee right to
demand government records, answerable in thirty days. Almost nobody uses it
successfully.

The government runs two separate websites. `rti.gov.in` explains the Act and
holds the directory of Public Information Officers. `rtionline.gov.in` is where
you file, pay, and start a legal clock. Neither site mentions the other. A paid
industry has grown up charging citizens hundreds of rupees to fill in a ten
rupee form.

Filing is the easy part. The reply period, the deemed refusal on silence, the
First Appeal and the Second Appeal are where applications are lost, and none of
that is visible on the portal after you pay.

## What this does

One guided journey: describe what you want, check jurisdiction, find the
authority, rewrite the request so it cannot be refused, run pre-flight checks,
practise the submission, then watch the clock. On day 31 silence becomes a
deemed refusal under section 7(2) and the First Appeal unlocks.

The process map under the clock is the same diagram the government publishes as
a low-resolution image. This one moves.

## Architecture

The rule engine decides. The model reads and writes.

- **`rules/`** All rule content as JSON. The journey pack carries every node,
  clock, warning and section reference, each with `sourceUrl`, `confidence` and
  `verifiedOn`. Nothing is invented in code.
- **`lib/engine/`** Pure functions over the rule pack: topological sort,
  condition evaluation, clock resolution, lock and lapse state. No network, no
  database, no model calls.
- **`lib/ai/`** The only place a language model is used. It rewrites the
  citizen's wording into a request for records and extracts structure. It never
  decides jurisdiction, deadlines, eligibility, authority or consequences.
- **`content/`** Every user-facing string.
- **`components/`, `app/`** Next.js App Router UI.

Model output is normalised before it becomes filing text, because the portal
accepts a narrow character set and a curly apostrophe from a language model
would fail the application's own pre-flight check.

## Constraints

Enforced, not merely stated. See `docs/AGENTS.md` for the full set.

1. No live government system is contacted, ever.
2. Simulated OTP and payment screens are visibly ours and labelled.
3. No real Aadhaar or PAN data. The Aadhaar field runs the Verhoeff checksum
   backwards: a number that **passes** is refused and cleared, because a passing
   number could be somebody's real Aadhaar. Only checksum-failing numbers are
   accepted, and tests assert the generated demo numbers all fail.
4. Deadlines, jurisdiction and legal consequences come from the deterministic
   engine only.
5. No rupee figure for any fee except the statutory ten rupee application fee
   and the two rupee per page copying charge. A test enforces this.
6. No em dashes in user-facing copy. A test enforces this.
7. A non-dismissible disclaimer strip on every page.

## Running it

```bash
npm install
npm run dev
```

The rewrite step needs an OpenAI key. Copy `.env.example` to `.env.local` and
fill in `OPENAI_API_KEY`. Without it the app degrades honestly: it keeps the
citizen's wording and says the rewriting service is unavailable.

```bash
npm test        # rule engine, checksum and copy constraints
npm run build
npm run lint
```

## Status

A hackathon prototype, built in phases. The journey, the clock, the appeal
ladder and the Section 18 complaint route all work end to end against the rule
pack. Everything labelled simulated is simulated.
