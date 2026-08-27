/**
 * Deep overlay of a translation onto the English copy.
 *
 * A translation file only carries the keys it translates. Everything it does
 * not name falls through to English, so a partly finished language degrades to
 * English per string rather than rendering an empty label. Functions are
 * carried across untouched unless the translation replaces them.
 *
 * Lists of the same length are overlaid item by item, so a translated
 * navigation entry can carry its label alone and keep the English href
 * beside it. A list of a different length replaces the English one outright,
 * because that is a genuinely different list rather than a translation of it.
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
  if (Array.isArray(base) && Array.isArray(patch) && base.length === patch.length) {
    return base.map((item, index) => overlay(item, patch[index])) as T;
  }
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
