import { finishValidation, formatDecimal } from 'react-cheminfo/core';

import { massComposition } from '../chemistry/composition.ts';
import { formulaText } from '../chemistry/formula.ts';
import type { Sample } from '../data/composition.ts';
import { SAMPLES } from '../data/composition.ts';
import { parseNumber } from '../exercises/answers.ts';
import { emptyCase, unreadableCase } from '../exercises/cases.ts';
import type {
  AnswerCheck,
  AnswerField,
  Answers,
  FieldCase,
  SeriesTool,
} from '../exercises/types.ts';

/** How far from the mass an answer may be, as a share of that mass. */
export const GRAMS_TOLERANCE = 0.01;

/** Give the mass of every element in a sample of a compound. */
export const GRAMS_TOOL: SeriesTool<Sample> = {
  id: 'grams',
  pool: SAMPLES,
  key: (sample) => `${sample.formula}/${sample.grams}`,
  fields: gramsFields,
  grade: gradeGrams,
  hints: gramsHints,
  solution: gramsSolution,
};

/**
 * One box per element of the compound.
 * @param sample - The sample.
 * @returns The boxes, keyed by element symbol.
 */
export function gramsFields(sample: Sample): AnswerField[] {
  return massComposition(sample.formula).elements.map((element) => ({
    key: element.symbol,
    label: `${element.symbol} (g)`,
    placeholder: 'mass in g',
  }));
}

/**
 * The mass of each element in a sample.
 * @param sample - The sample.
 * @returns Symbol → grams, in the order the formula names the elements.
 */
export function elementGrams(sample: Sample): Map<string, number> {
  const grams = new Map<string, number>();
  for (const element of massComposition(sample.formula).elements) {
    grams.set(element.symbol, (element.percent / 100) * sample.grams);
  }
  return grams;
}

/**
 * Grade the masses, each to within {@link GRAMS_TOLERANCE} of the right one.
 * @param sample - The sample.
 * @param answers - The masses typed, keyed by element symbol; a trailing `g`
 * is allowed.
 * @returns One case per element.
 */
export function gradeGrams(sample: Sample, answers: Answers): AnswerCheck {
  const composition = massComposition(sample.formula);
  const cases: FieldCase[] = [];
  for (const element of composition.elements) {
    const label = `${element.symbol} (g)`;
    const typed = answers[element.symbol] ?? '';
    if (typed.trim() === '') {
      cases.push(emptyCase(label, `the mass of ${element.symbol} in grams`));
      continue;
    }
    const value = parseNumber(typed.replace(/\s*g$/iu, ''));
    if (value === null) {
      cases.push(unreadableCase(label, typed, 'a mass in grams'));
      continue;
    }
    const expected = (element.percent / 100) * sample.grams;
    const passed = Math.abs(value - expected) <= GRAMS_TOLERANCE * expected;
    let reason = `Right: ${grams(expected)} g.`;
    if (!passed) {
      if (near(value, element.percent)) {
        reason = `That is the mass percent: take that share of the ${sample.grams} g of the sample.`;
      } else if (near(value, element.mass)) {
        reason = `That is the mass in one mole, in g/mol; the sample is ${sample.grams} g.`;
      } else {
        reason = `${typed.trim()} is more than 1 % from the mass of ${element.symbol} in the sample.`;
      }
    }
    cases.push({ label, passed, reason, actual: typed });
  }
  return finishValidation(cases);
}

/**
 * Hints for a mass-in-grams question, from the idea to the product.
 * @param sample - The sample.
 * @returns Three hints.
 */
export function gramsHints(sample: Sample): string[] {
  const composition = massComposition(sample.formula);
  const percents = composition.elements
    .map(
      (element) => `${element.symbol} ${formatDecimal(element.percent, 2)} %`,
    )
    .join(', ');
  const products = composition.elements
    .map(
      (element) =>
        `${element.symbol}: ${formatDecimal(element.percent / 100, 4)} × ${sample.grams} g`,
    )
    .join('; ');
  return [
    `Each element makes up the same share of ${sample.grams} g of ${formulaText(sample.formula)} as of one mole of it: its [[mass percent]].`,
    `The mass percents of ${formulaText(sample.formula)}: ${percents}.`,
    `${products}.`,
  ];
}

/**
 * The worked masses.
 * @param sample - The sample.
 * @returns Every element's share times the mass of the sample.
 */
export function gramsSolution(sample: Sample): string {
  const composition = massComposition(sample.formula);
  const lines = composition.elements
    .map(
      (element) =>
        `${element.symbol}: ${formatDecimal(element.percent, 2)} % × ${sample.grams} g = **${grams((element.percent / 100) * sample.grams)} g**`,
    )
    .join('; ');
  return `${lines}.`;
}

function near(value: number, target: number): boolean {
  return Math.abs(value - target) <= GRAMS_TOLERANCE * Math.abs(target);
}

function grams(value: number): string {
  return formatDecimal(value, value < 10 ? 3 : 2);
}
