/**
 * Verhoeff checksum, the scheme Aadhaar numbers use for their last digit.
 *
 * This prototype must never hold a real Aadhaar number. The check is used the
 * opposite way round from normal: a number that PASSES is refused, because a
 * passing number could be somebody's actual Aadhaar. Only numbers that fail the
 * checksum are accepted, and the demo number we offer is generated to fail.
 */

const multiply = [
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
];

const permute = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
];

const inverse = [0, 4, 3, 2, 1, 5, 6, 7, 8, 9];

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

function verhoeffChecksum(digits: string): number {
  let check = 0;
  const reversed = digits.split("").reverse();

  for (let index = 0; index < reversed.length; index += 1) {
    const digit = Number(reversed[index]);
    check = multiply[check][permute[index % 8][digit]];
  }

  return check;
}

/** True when the number satisfies the Verhoeff check, so it must be refused. */
export function passesVerhoeff(value: string): boolean {
  const digits = digitsOnly(value);
  if (digits.length === 0) return false;
  return verhoeffChecksum(digits) === 0;
}

/** The check digit that WOULD make a body valid. Used only to avoid producing it. */
function validCheckDigit(body: string): number {
  return inverse[verhoeffChecksum(`${body}0`)];
}

/**
 * Builds a 12 digit number in Aadhaar's shape that deliberately fails the
 * checksum, so it can never collide with a real Aadhaar number.
 */
export function synthesiseInvalidAadhaar(seed = 0): string {
  const body = String(200000000000 + (seed % 100000000000)).slice(0, 11);
  const valid = validCheckDigit(body);
  // Any digit other than the correct one guarantees the checksum fails.
  const wrong = (valid + 1) % 10;
  return `${body}${wrong}`;
}
