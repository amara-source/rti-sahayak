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
  matches: string[];
}

export interface AuthorityMatch {
  authority: AuthorityRule;
  /** The authored term that matched, so the UI can show its reasoning. */
  matchedTerm: string | null;
}

const authorities = authorityRules.authorities as AuthorityRule[];

export function listAuthorities(): AuthorityRule[] {
  return authorities.map((authority) => ({
    ...authority,
    matches: [...authority.matches],
  }));
}

export function matchAuthorityWithReason(subject: string): AuthorityMatch {
  const normalized = subject.toLocaleLowerCase("en-IN");

  for (const authority of authorities) {
    if (authority.id === "unknown_central") continue;
    const matchedTerm = authority.matches.find((term) =>
      normalized.includes(term.toLocaleLowerCase("en-IN")),
    );
    if (matchedTerm) {
      return { authority, matchedTerm };
    }
  }

  return {
    authority: authorities.find((item) => item.id === "unknown_central")!,
    matchedTerm: null,
  };
}

export function matchAuthority(subject: string): AuthorityRule {
  return matchAuthorityWithReason(subject).authority;
}
