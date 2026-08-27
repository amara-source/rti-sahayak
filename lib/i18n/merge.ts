/**
 * Deep overlay of a translation onto the English copy.
 *
 * A translation file only carries the keys it translates. Everything it does
 * not name falls through to English, so a partly finished language degrades to
 * English per string rather than rendering an empty label. Functions are
 * carried across untouched unless the translation replaces them.
 */
type Plain = Record<string, unknown>;

function isPlainObject(value: unknown): value is Plain {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    typeof value !== "function"
  );
}

export function overlay<T>(base: T, patch: unknown): T {
  if (!isPlainObject(patch) || !isPlainObject(base)) {
    return (patch === undefined ? base : (patch as T));
  }
  const result: Plain = { ...(base as Plain) };
  for (const [key, value] of Object.entries(patch)) {
    result[key] = key in (base as Plain)
      ? overlay((base as Plain)[key], value)
      : value;
  }
  return result as T;
}
