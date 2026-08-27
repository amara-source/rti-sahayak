import type { RenderedNode } from "@/lib/engine/types";

/**
 * A node's title in the selected language.
 *
 * The translation lives in the rule pack beside the English, so node content
 * still comes only from /rules. Where a node has no translation this returns
 * the English, which is correct on its own; what it prevents is a Hindi label
 * naming an English step in the same sentence.
 */
export function nodeTitle(
  node: Pick<RenderedNode, "title"> & { hi?: { title?: string } },
  language: string,
): string {
  if (language === "hi" && node.hi?.title) return node.hi.title;
  return node.title;
}
