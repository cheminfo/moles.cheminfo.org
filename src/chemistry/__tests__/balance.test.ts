import { expect, test } from 'vitest';

import { REACTIONS } from '../../data/reactions.ts';
import { balanceReaction, sideTotals, splitSide } from '../balance.ts';

test('a side of a reaction splits on its separators, never inside a charge', () => {
  expect(splitSide('C8H18 + O2')).toStrictEqual(['C8H18', 'O2']);
  expect(splitSide('FeCl3 +I2\t+ KCl')).toStrictEqual(['FeCl3', 'I2', 'KCl']);
  expect(splitSide('H2+O2')).toStrictEqual(['H2', 'O2']);
  expect(splitSide('Na+ + Cl-')).toStrictEqual(['Na+', 'Cl-']);
  expect(splitSide('Fe(3+) + OH(-)')).toStrictEqual(['Fe(3+)', 'OH(-)']);
});

test('the classic combustions balance with the smallest whole numbers', () => {
  expect(
    balanceReaction({ reactants: ['C8H18', 'O2'], products: ['CO2', 'H2O'] }),
  ).toStrictEqual({ ok: true, coefficients: [2, 25, 16, 18] });
  expect(
    balanceReaction({ reactants: ['H2', 'O2'], products: ['H2O'] }),
  ).toStrictEqual({ ok: true, coefficients: [2, 1, 2] });
});

test('a redox with an ion balances its charge too', () => {
  expect(
    balanceReaction({
      reactants: ['MnO4(-)', 'Fe(2+)', 'H(+)'],
      products: ['Mn(2+)', 'Fe(3+)', 'H2O'],
    }),
  ).toStrictEqual({ ok: true, coefficients: [1, 5, 8, 1, 5, 4] });
});

test('every reaction of the pool has exactly one balanced form', () => {
  const unbalanced = REACTIONS.filter(
    (reaction) => !balanceReaction(reaction).ok,
  );
  expect(unbalanced).toStrictEqual([]);
  expect(REACTIONS).toHaveLength(53);
});

test('a reaction that cannot be balanced, or not in one way, says so', () => {
  expect(
    balanceReaction({ reactants: ['H2'], products: ['O2'] }),
  ).toMatchObject({ ok: false, reason: 'unbalanceable' });
  expect(
    balanceReaction({
      reactants: ['CO', 'CO2', 'H2'],
      products: ['CH4', 'H2O'],
    }),
  ).toMatchObject({ ok: false, reason: 'not-unique' });
  expect(balanceReaction({ reactants: [], products: ['O2'] })).toMatchObject({
    ok: false,
    reason: 'too-few-species',
  });
});

test('the element totals of each side, for given coefficients', () => {
  expect(
    sideTotals({ reactants: ['H2', 'O2'], products: ['H2O'] }, [2, 1, 1]),
  ).toStrictEqual([
    { label: 'H', left: 4, right: 2 },
    { label: 'O', left: 2, right: 1 },
  ]);
});
