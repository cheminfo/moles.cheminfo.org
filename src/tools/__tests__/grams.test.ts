import { expect, test } from 'vitest';

import { SAMPLES } from '../../data/composition.ts';
import { GRAMS_TOOL, elementGrams } from '../grams.ts';

const alumina = { formula: 'Al2O3', grams: 20 };

test('the mass of each element of a sample', () => {
  const grams = elementGrams(alumina);
  expect(grams.get('Al')).toBeCloseTo(10.585, 3);
  expect(grams.get('O')).toBeCloseTo(9.415, 3);
});

test('masses within one percent pass, a trailing g allowed', () => {
  expect(GRAMS_TOOL.grade(alumina, { Al: '10.6 g', O: '9.42' }).passed).toBe(
    true,
  );
  expect(GRAMS_TOOL.grade(alumina, { Al: '10.9', O: '9.42' }).passed).toBe(
    false,
  );
});

test('a percent, or a mass per mole, typed as grams is named', () => {
  expect(
    GRAMS_TOOL.grade(alumina, { Al: '52.93', O: '48 g' }).cases.map(
      (verdict) => verdict.reason,
    ),
  ).toStrictEqual([
    'That is the mass percent: take that share of the 20 g of the sample.',
    'That is the mass in one mole, in g/mol; the sample is 20 g.',
  ]);
});

test('the solution multiplies each share by the sample', () => {
  expect(GRAMS_TOOL.solution(alumina)).toBe(
    'Al: 52.93 % × 20 g = **10.59 g**; O: 47.07 % × 20 g = **9.415 g**.',
  );
});

test('every sample of the pool has hints and a solution', () => {
  expect(SAMPLES).toHaveLength(7);
  for (const sample of SAMPLES) {
    expect(GRAMS_TOOL.hints(sample)).toHaveLength(3);
    expect(GRAMS_TOOL.solution(sample)).toContain(' g**');
  }
});
