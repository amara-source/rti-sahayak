/**
 * The RTI Online form accepts a narrow character set, and the pre-flight
 * charset check in the rule pack enforces exactly that set. A language model
 * writes ordinary prose: curly quotes, en and em dashes, ellipses. Left alone,
 * the rewritten request fails our own check the moment it is generated.
 *
 * This is a text transformation only. It changes no fact and decides nothing.
 */

const typographicPairs: Array<[RegExp, string]> = [
  [/[‘’‚‛]/g, "'"], // single curly quotes
  [/[“”„‟]/g, '"'], // double curly quotes
  [/[–—―]/g, "-"], // en dash, em dash, horizontal bar
  [/…/g, "..."], // ellipsis
  [/ /g, " "], // non-breaking space
  [/[′‵]/g, "'"], // primes
];

/**
 * Replaces typographic characters with their plain equivalents. Used for
 * explanatory copy, where an apostrophe is legitimate and only the characters
 * banned by the house style need to go.
 */
export function normaliseTypography(text: string): string {
  return typographicPairs.reduce(
    (value, [pattern, replacement]) => value.replace(pattern, replacement),
    text,
  );
}

/**
 * Normalises typography and then removes anything the portal form rejects, so
 * the rewritten request passes the authored charset check.
 */
export function sanitiseForPortal(text: string): string {
  return normaliseTypography(text)
    // Apostrophes and quotes are not in the accepted set at all, so the word
    // has to survive without them: "father's" becomes "fathers".
    .replace(/['"]/g, "")
    .replace(/[^A-Za-z0-9,\.\-_()\/@:&?\\%\s]/g, "")
    // Removing characters can leave doubled spaces behind.
    .replace(/[ \t]{2,}/g, " ")
    .trimEnd();
}
