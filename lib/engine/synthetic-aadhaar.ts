const multiplicationTable = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
  [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
  [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
  [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
  [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
  [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
  [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
  [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
] as const;

const permutationTable = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
] as const;

export function isVerhoeffValid(value: string): boolean {
  if (!/^\d+$/.test(value)) {
    return false;
  }

  let checksum = 0;
  const digits = [...value].reverse().map(Number);

  for (let index = 0; index < digits.length; index += 1) {
    const digit = digits[index];
    checksum = multiplicationTable[checksum][
      permutationTable[index % 8][digit]
    ];
  }

  return checksum === 0;
}

export function generateSyntheticAadhaar(seed: number): string {
  const safeSeed = Number.isFinite(seed) ? Math.abs(Math.trunc(seed)) : 0;
  const body = `9999${String(safeSeed % 10_000_000).padStart(7, "0")}`;
  const validDigit = Array.from({ length: 10 }, (_, digit) => digit).find(
    (digit) => isVerhoeffValid(`${body}${digit}`),
  );

  if (validDigit === undefined) {
    throw new Error("Unable to construct a synthetic Aadhaar test number");
  }

  const deliberatelyInvalidDigit = (validDigit + 1) % 10;
  return `${body}${deliberatelyInvalidDigit}`;
}
