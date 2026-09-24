import { expect, test } from 'vitest';

import { REACTIONS } from '../../data/reactions.ts';
import { BALANCE_TOOL, balancedEquation, reactionLevel } from '../balance.ts';

const glucose = { reactants: ['C6H12O6', 'O2'], products: ['H2O', 'CO2'] };

function answer(...coefficients: number[]) {
  return Object.fromEntries(
    coefficients.map((value, index) => [`species${index}`, String(value)]),
  );
}

test('one box per species, labelled with its formula', () => {
  expect(
    BALANCE_TOOL.fields(glucose).map((field) => field.label),
  ).toStrictEqual(['C₆H₁₂O₆', 'O₂', 'H₂O', 'CO₂']);
});

test('the balanced answer passes every case', () => {
  const check = BALANCE_TOOL.grade(glucose, answer(1, 6, 6, 6));
  expect(check.passed).toBe(true);
  expect(
    check.cases.map((verdict) => [verdict.label, verdict.reason]),
  ).toStrictEqual([
    ['C', '6 on each side.'],
    ['H', '12 on each side.'],
    ['O', '18 on each side.'],
    ['Smallest whole numbers', 'The coefficients share no common factor.'],
  ]);
});

test('the element left unbalanced is named, and a multiple is refused', () => {
  const wrong = BALANCE_TOOL.grade(glucose, answer(1, 5, 6, 6));
  expect(wrong.passed).toBe(false);
  expect(wrong.cases[2]).toStrictEqual({
    label: 'O',
    passed: false,
    reason: '16 on the left, 18 on the right.',
    actual: '16 → 18',
  });
  const doubled = BALANCE_TOOL.grade(glucose, answer(2, 12, 12, 12));
  expect(doubled.passed).toBe(false);
  expect(doubled.cases.at(-1)?.reason).toBe(
    'Every coefficient divides by 2: divide them all by 2.',
  );
});

test('an empty or zero coefficient is asked for again', () => {
  const check = BALANCE_TOOL.grade(glucose, {
    species0: '',
    species1: '0',
    species2: '6',
    species3: '6',
  });
  expect(check.cases.map((verdict) => verdict.reason)).toStrictEqual([
    'Type a coefficient, a 1 included.',
    '“0” is not a whole number greater than zero.',
  ]);
});

test('the hints end on the first two coefficients', () => {
  expect(BALANCE_TOOL.hints(glucose)).toStrictEqual([
    'Count the atoms of each element on both sides. A [[coefficient]] multiplies every atom of its formula; an index only the atom it follows.',
    'Start with C: it is in a single formula on each side. Leave H and O, found in many formulas, for last.',
    'The balanced reaction starts with 1 C₆H₁₂O₆ and 6 O₂.',
  ]);
});

test('the solution writes the equation, a 1 unwritten', () => {
  expect(BALANCE_TOOL.solution(glucose)).toBe(
    '**C₆H₁₂O₆ + 6 O₂ → 6 H₂O + 6 CO₂**',
  );
  expect(
    balancedEquation({ reactants: ['H2', 'O2'], products: ['H2O'] }, [2, 1, 2]),
  ).toBe('2 H₂ + O₂ → 2 H₂O');
});

test('levels follow the number of species', () => {
  const counts = { beginner: 0, intermediate: 0, advanced: 0 };
  for (const reaction of REACTIONS) counts[reactionLevel(reaction)]++;
  expect(counts).toStrictEqual({ beginner: 4, intermediate: 28, advanced: 21 });
});
