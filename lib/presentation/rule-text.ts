const citizenCostPattern = /\b(?:fee|fees|charge|charges)\b/i;

export function citizenSafeRuleText(text: string): string {
  return (text.match(/[^.!?]+[.!?]?/g) ?? [text])
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence && !citizenCostPattern.test(sentence))
    .join(" ");
}
