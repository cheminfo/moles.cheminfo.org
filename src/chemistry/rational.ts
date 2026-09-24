/** An exact rational number, reduced, with a strictly positive denominator. */
export interface Rational {
  numerator: bigint;
  denominator: bigint;
}

/** Zero, as a rational. */
export const ZERO: Rational = { numerator: 0n, denominator: 1n };

/**
 * A reduced rational.
 * @param numerator - The numerator.
 * @param denominator - The denominator, never zero.
 * @returns The fraction, reduced, its sign on the numerator.
 */
export function rational(numerator: bigint, denominator: bigint): Rational {
  if (denominator === 0n) {
    throw new Error('a rational cannot have a zero denominator');
  }
  const sign = denominator < 0n ? -1n : 1n;
  const divisor = gcd(numerator, denominator) || 1n;
  return {
    numerator: (sign * numerator) / divisor,
    denominator: (sign * denominator) / divisor,
  };
}

/**
 * A whole number, as a rational.
 * @param value - The integer.
 * @returns It over one.
 */
export function fromInteger(value: number | bigint): Rational {
  return { numerator: BigInt(value), denominator: 1n };
}

/**
 * The difference of two rationals.
 * @param a - The first.
 * @param b - The one taken away.
 * @returns `a − b`.
 */
export function subtract(a: Rational, b: Rational): Rational {
  return rational(
    a.numerator * b.denominator - b.numerator * a.denominator,
    a.denominator * b.denominator,
  );
}

/**
 * The product of two rationals.
 * @param a - The first.
 * @param b - The second.
 * @returns `a × b`.
 */
export function multiply(a: Rational, b: Rational): Rational {
  return rational(a.numerator * b.numerator, a.denominator * b.denominator);
}

/**
 * The quotient of two rationals.
 * @param a - The dividend.
 * @param b - The divisor, never zero.
 * @returns `a / b`.
 */
export function divide(a: Rational, b: Rational): Rational {
  if (b.numerator === 0n) {
    throw new Error('a rational cannot be divided by zero');
  }
  return rational(a.numerator * b.denominator, a.denominator * b.numerator);
}

/**
 * The greatest common divisor, never negative.
 * @param a - One integer.
 * @param b - The other.
 * @returns gcd(a, b), zero only when both are.
 */
export function gcd(a: bigint, b: bigint): bigint {
  let x = a < 0n ? -a : a;
  let y = b < 0n ? -b : b;
  while (y !== 0n) {
    const rest = x % y;
    x = y;
    y = rest;
  }
  return x;
}

/**
 * The least common multiple, never negative.
 * @param a - One integer.
 * @param b - The other.
 * @returns lcm(a, b), zero when either is.
 */
export function lcm(a: bigint, b: bigint): bigint {
  if (a === 0n || b === 0n) return 0n;
  const product = a * b;
  return (product < 0n ? -product : product) / gcd(a, b);
}
