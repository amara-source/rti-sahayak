import authorityRules from "../../rules/rti/authorities.json";

export interface AuthorityRule {
  id: string;
  name: string;
  ministry: string;
  officer: string;
  /** Which office actually holds the file. The designation alone is not enough. */
  officerNote: string;
  /** The kinds of record this authority holds, so the citizen can aim the request. */
  records: string;
  /** The body's own RTI page, or the government directory when it has none. */
  siteUrl: string;
  siteLabel: string;
  /** Which government this body belongs to. */
  level: "central" | "state";
  matches: string[];
}

export interface AuthorityMatch {
  authority: AuthorityRule;
  /** The authored term that matched, so the UI can show its reasoning. */
  matchedTerm: string | null;
}

const authorities = authorityRules.authorities as AuthorityRule[];

const ignoredMatchWords = new Set([
  "a",
  "an",
  "and",
  "central",
  "government",
  "my",
  "of",
  "the",
]);

function words(value: string): Set<string> {
  return new Set(
    value
      .toLocaleLowerCase("en-IN")
      .split(/[^\p{L}\p{N}]+/u)
      .filter((word) => word.length > 1 && !ignoredMatchWords.has(word)),
  );
}

export function listAuthorities(): AuthorityRule[] {
  return authorities.map((authority) => ({
    ...authority,
    matches: [...authority.matches],
  }));
}

export function listAuthoritiesForLevel(
  level: "central" | "state",
): AuthorityRule[] {
  return listAuthorities().filter((authority) => authority.level === level);
}

export function matchAuthorityWithReason(
  subject: string,
  level: "central" | "state" = "central",
): AuthorityMatch {
  const subjectWords = words(subject);
  let best: { authority: AuthorityRule; matchedTerm: string; score: number } | null = null;

  for (const authority of authorities) {
    if (authority.level !== level) continue;
    if (authority.id.startsWith("unknown_")) continue;
    for (const term of authority.matches) {
      const termWords = words(term);
      const score = [...termWords].filter((word) => subjectWords.has(word)).length;
      if (score > 0 && (!best || score > best.score)) {
        best = { authority, matchedTerm: term, score };
      }
    }
  }

  if (best) {
    return { authority: best.authority, matchedTerm: best.matchedTerm };
  }

  return {
    authority: authorities.find(
      (item) => item.id === (level === "state" ? "unknown_state" : "unknown_central"),
    )!,
    matchedTerm: null,
  };
}

export function matchAuthority(
  subject: string,
  level: "central" | "state" = "central",
): AuthorityRule {
  return matchAuthorityWithReason(subject, level).authority;
}
