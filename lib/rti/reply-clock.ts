/**
 * The reply clock, in one place.
 *
 * The citizen's tracker and the officer preview show the same case from two
 * sides, so they must not each do this arithmetic their own way. The limits
 * come from the rule pack: thirty days under section 7(1), or forty eight
 * hours where life or liberty is involved.
 */
export interface ReplyClock {
  /** Hours where life or liberty is involved, days otherwise. */
  countsInHours: boolean;
  elapsed: number;
  remaining: number;
  overdue: number;
  /** The reply period has run out, so silence is a refusal in law. */
  lapsed: boolean;
}

const ORDINARY_DAYS = 30;
const LIBERTY_HOURS = 48;

export function replyClock(elapsedHours: number, lifeLiberty: boolean): ReplyClock {
  const limitHours = lifeLiberty ? LIBERTY_HOURS : ORDINARY_DAYS * 24;
  const countsInHours = lifeLiberty;
  const elapsed = countsInHours ? elapsedHours : Math.floor(elapsedHours / 24);
  const limit = countsInHours ? LIBERTY_HOURS : ORDINARY_DAYS;
  return {
    countsInHours,
    elapsed,
    remaining: Math.max(0, limit - elapsed),
    overdue: Math.max(0, elapsed - limit),
    lapsed: elapsedHours > limitHours,
  };
}
