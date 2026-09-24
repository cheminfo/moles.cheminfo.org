import { expect, test } from 'vitest';

import {
  divide,
  fromInteger,
  gcd,
  lcm,
  multiply,
  rational,
  subtract,
} from '../rational.ts';

test('a rational is kept reduced, its sign on the numerator', () => {
  expect(rational(4n, -6n)).toStrictEqual({ numerator: -2n, denominator: 3n });
  expect(() => rational(1n, 0n)).toThrow(
    'a rational cannot have a zero denominator',
  );
});

test('the four operations are exact', () => {
  const third = rational(1n, 3n);
  expect(subtract(fromInteger(1), third)).toStrictEqual(rational(2n, 3n));
  expect(multiply(third, fromInteger(3))).toStrictEqual(fromInteger(1));
  expect(divide(third, rational(2n, 3n))).toStrictEqual(rational(1n, 2n));
  expect(() => divide(third, fromInteger(0))).toThrow(
    'a rational cannot be divided by zero',
  );
});

test('gcd and lcm never go negative', () => {
  expect(gcd(-12n, 18n)).toBe(6n);
  expect(lcm(-4n, 6n)).toBe(12n);
  expect(lcm(0n, 6n)).toBe(0n);
});
