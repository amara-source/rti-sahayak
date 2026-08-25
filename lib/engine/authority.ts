import authorityRules from "../../rules/rti/authorities.json";

export interface AuthorityRule {
  id: string;
  name: string;
  ministry: string;
  officer: string;
  matches: string[];
}

const authorities = authorityRules.authorities as AuthorityRule[];

export function listAuthorities(): AuthorityRule[] {
  return authorities.map((authority) => ({
    ...authority,
    matches: [...authority.matches],
  }));
}

export function matchAuthority(subject: string): AuthorityRule {
  const normalized = subject.toLocaleLowerCase("en-IN");
  const match = authorities.find(
    (authority) =>
      authority.id !== "unknown_central" &&
      authority.matches.some((term) =>
        normalized.includes(term.toLocaleLowerCase("en-IN")),
      ),
  );

  return (
    match ??
    authorities.find((authority) => authority.id === "unknown_central")!
  );
}
