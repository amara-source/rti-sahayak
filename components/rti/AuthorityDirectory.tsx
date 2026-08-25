"use client";

import { useMemo, useState } from "react";
import { Icon } from "./Icon";
import { authorityIcon } from "@/lib/rti/icon-map";

export interface DirectoryAuthority {
  id: string;
  name: string;
  ministry: string;
  officer: string;
  matches: string[];
}

export function AuthorityDirectory({ authorities }: { authorities: DirectoryAuthority[] }) {
  const [query, setQuery] = useState("");
  const visible = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    if (!needle) return authorities;
    return authorities.filter((authority) =>
      [authority.name, authority.ministry, authority.officer, ...authority.matches]
        .join(" ")
        .toLocaleLowerCase()
        .includes(needle),
    );
  }, [authorities, query]);

  return (
    <div className="authority-directory">
      <label className="authority-directory__search">
        <span>Search by subject, authority or ministry</span>
        <input
          onChange={(event) => setQuery(event.target.value)}
          placeholder="For example: pension, EPFO, passport"
          type="search"
          value={query}
        />
      </label>

      <p className="authority-directory__note">
        The officer directory and the filing portal are two separate government websites and neither mentions the other.
      </p>

      {visible.length > 0 ? (
        <div className="authority-grid">
          {visible.map((authority) => (
            <article className="authority-card" key={authority.id}>
              <span className="rti-icon-tile"><Icon name={authorityIcon(authority.id)} /></span>
              <span className="authority-card__level">Central</span>
              <h2>{authority.name}</h2>
              <dl>
                <div><dt>Ministry</dt><dd>{authority.ministry}</dd></div>
                <div><dt>Officer title</dt><dd>{authority.officer}</dd></div>
              </dl>
              <p><strong>Useful search terms:</strong> {authority.matches.join(", ")}</p>
            </article>
          ))}
        </div>
      ) : (
        <div className="authority-directory__empty" role="status">
          <span className="rti-icon-tile"><Icon name="question" /></span>
          <h2>No authority matched that search</h2>
          <p>We could not work out which authority this belongs to. The government&apos;s own directory of Public Information Officers is at rti.gov.in. Search there, then come back and enter it.</p>
          <a href="https://rti.gov.in/" rel="noreferrer" target="_blank">Open the government officer directory</a>
        </div>
      )}
    </div>
  );
}
