import { expect, test } from 'vitest';

import { PERCENT_FORMULAS } from '../../data/composition.ts';
import { PERCENT_TOOL } from '../percent.ts';

test('one box per element', () => {
  expect(PERCENT_TOOL.fields('C2H5OH').map((field) => field.key)).toStrictEqual(
    ['C', 'H', 'O'],
  );
});

test('percents within a tenth of a point pass', () => {
  expect(
    PERCENT_TOOL.grade('C2H5OH', { C: '52.14', H: '13,1', O: '34.73 %' })
      .passed,
  ).toBe(true);
  expect(
    PERCENT_TOOL.grade('C2H5OH', { C: '52.3', H: '13.13', O: '34.73' }).passed,
  ).toBe(false);
});

test('the share of the atoms, and a total off 100, are named', () => {
  expect(
    PERCENT_TOOL.grade('C2H5OH', { C: '22.2', H: '66.7', O: '11.1' }).cases.map(
      (verdict) => verdict.reason,
    ),
  ).toStrictEqual([
    'That is the share of the atoms, not of the mass.',
    'That is the share of the atoms, not of the mass.',
    '11.1 % is more than 0.1 point from the share of O in the molar mass.',
  ]);
  expect(
    PERCENT_TOOL.grade('H2O', { H: '20', O: '88.81' }).cases[0]?.reason,
  ).toBe('Your percents add up to 108.81 %, not 100 %.');
});

test('the hints end on the molar mass, the solution on every share', () => {
  expect(PERCENT_TOOL.hints('CaCO3')[2]).toBe(
    'M(CaCO₃) = 40.078 + 12.011 + 3 × 15.999 = 100.087 g/mol.',
  );
  expect(PERCENT_TOOL.solution('H2O')).toBe(
    'H: 2.016 / 18.015 = **11.19 %**; O: 15.999 / 18.015 = **88.81 %**.',
  );
});

test('every compound of the pool has hints and a solution', () => {
  for (const formula of PERCENT_FORMULAS) {
    expect(PERCENT_TOOL.hints(formula)).toHaveLength(3);
    expect(PERCENT_TOOL.solution(formula)).toContain(' %**');
  }
});
