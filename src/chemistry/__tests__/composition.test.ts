import { expect, test } from 'vitest';

import { PERCENT_FORMULAS, SAMPLES } from '../../data/composition.ts';
import { massComposition } from '../composition.ts';

test('the mass composition of water', () => {
  const water = massComposition('H2O');
  expect(water.molarMass).toBeCloseTo(18.015, 3);
  expect(
    water.elements.map(({ symbol, count, percent }) => [
      symbol,
      count,
      Number(percent.toFixed(2)),
    ]),
  ).toStrictEqual([
    ['H', 2, 11.19],
    ['O', 1, 88.81],
  ]);
});

test('the share of the atoms is kept apart from the share of the mass', () => {
  const [hydrogen] = massComposition('H2O').elements;
  expect(hydrogen?.atomPercent).toBeCloseTo(66.667, 3);
});

test('calcium carbonate and iron(III) oxide, checked by hand', () => {
  const calcite = massComposition('CaCO3');
  expect(calcite.molarMass).toBeCloseTo(100.087, 3);
  expect(
    Object.fromEntries(
      calcite.elements.map((element) => [
        element.symbol,
        Number(element.percent.toFixed(2)),
      ]),
    ),
  ).toStrictEqual({ Ca: 40.04, C: 12, O: 47.96 });
  const hematite = massComposition('Fe2O3');
  expect(hematite.elements[0]?.percent).toBeCloseTo(69.94, 2);
});

test('a hydrate counts its water', () => {
  expect(massComposition('MgSO4.H2O').molarMass).toBeCloseTo(138.383, 3);
});

test('every compound of the pools can be analysed, its percents adding to 100', () => {
  for (const formula of [
    ...PERCENT_FORMULAS,
    ...SAMPLES.map((sample) => sample.formula),
  ]) {
    let total = 0;
    for (const element of massComposition(formula).elements) {
      total += element.percent;
    }
    expect({ formula, total: Number(total.toFixed(9)) }).toStrictEqual({
      formula,
      total: 100,
    });
  }
  expect(PERCENT_FORMULAS).toHaveLength(62);
});
