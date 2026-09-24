import { finishValidation, formatDecimal } from 'react-cheminfo/core';

import type { Composition } from '../chemistry/composition.ts';
import { massComposition } from '../chemistry/composition.ts';
import { formulaText } from '../chemistry/formula.ts';
import { PERCENT_FORMULAS } from '../data/composition.ts';
import { parseNumber } from '../exercises/answers.ts';
import { emptyCase, unreadableCase } from '../exercises/cases.ts';
import type {
  AnswerCheck,
  AnswerField,
  Answers,
  FieldCase,
  SeriesTool,
} from '../exercises/types.ts';

/** How far from the mass percent an answer may be, in percentage points. */
export const PERCENT_TOLERANCE = 0.1;

/** Give the mass percent of every element of a compound. */
export const PERCENT_TOOL: SeriesTool<string> = {
  id: 'percent',
  pool: PERCENT_FORMULAS,
  key: (formula) => formula,
  fields: percentFields,
  grade: gradePercent,
  hints: percentHints,
  solution: percentSolution,
};

/**
 * One box per element of the compound.
 * @param formula - The compound.
 * @returns The boxes, keyed by element symbol.
 */
export function percentFields(formula: string): AnswerField[] {
  return massComposition(formula).elements.map((element) => ({
    key: element.symbol,
    label: `${element.symbol} (%)`,
    placeholder: 'mass %',
  }));
}

/**
 * Grade the mass percents, each to within {@link PERCENT_TOLERANCE} points.
 * @param formula - The compound.
 * @param answers - The percents typed, keyed by element symbol.
 * @returns One case per element.
 */
export function gradePercent(formula: string, answers: Answers): AnswerCheck {
  const composition = massComposition(formula);
  const typedSum = sumOfTyped(composition, answers);
  const cases: FieldCase[] = [];
  for (const element of composition.elements) {
    const label = `${element.symbol} (%)`;
    const typed = answers[element.symbol] ?? '';
    if (typed.trim() === '') {
      cases.push(emptyCase(label, `the mass percent of ${element.symbol}`));
      continue;
    }
    const value = parseNumber(typed);
    if (value === null) {
      cases.push(unreadableCase(label, typed, 'a number'));
      continue;
    }
    const passed = Math.abs(value - element.percent) <= PERCENT_TOLERANCE;
    let reason = `Right: ${percent(element.percent)} %.`;
    if (!passed) {
      if (
        element.count !== 1 &&
        Math.abs(value - element.atomPercent) <= PERCENT_TOLERANCE
      ) {
        reason = 'That is the share of the atoms, not of the mass.';
      } else if (typedSum !== null && Math.abs(typedSum - 100) > 0.5) {
        reason = `Your percents add up to ${percent(typedSum)} %, not 100 %.`;
      } else {
        reason = `${typed.trim()} % is more than ${PERCENT_TOLERANCE} point from the share of ${element.symbol} in the molar mass.`;
      }
    }
    cases.push({ label, passed, reason, actual: typed });
  }
  return finishValidation(cases);
}

/**
 * Hints for a mass-percent question, from the definition to the masses.
 * @param formula - The compound.
 * @returns Three hints.
 */
export function percentHints(formula: string): string[] {
  const composition = massComposition(formula);
  const masses = composition.elements
    .map((element) => `${element.symbol} ${mass(element.atomicMass)}`)
    .join(', ');
  const terms = composition.elements
    .map((element) =>
      element.count === 1
        ? mass(element.atomicMass)
        : `${element.count} × ${mass(element.atomicMass)}`,
    )
    .join(' + ');
  return [
    'The [[mass percent]] of an element is the mass it brings to one mole of the compound, divided by the [[molar mass]].',
    `Atomic masses, in g/mol: ${masses}.`,
    `M(${formulaText(formula)}) = ${terms} = ${mass(composition.molarMass)} g/mol.`,
  ];
}

/**
 * The worked mass composition.
 * @param formula - The compound.
 * @returns Every element's mass over the molar mass.
 */
export function percentSolution(formula: string): string {
  const composition = massComposition(formula);
  const shares = composition.elements
    .map(
      (element) =>
        `${element.symbol}: ${mass(element.mass)} / ${mass(composition.molarMass)} = **${percent(element.percent)} %**`,
    )
    .join('; ');
  return `${shares}.`;
}

function sumOfTyped(composition: Composition, answers: Answers): number | null {
  let sum = 0;
  for (const element of composition.elements) {
    const value = parseNumber(answers[element.symbol] ?? '');
    if (value === null) return null;
    sum += value;
  }
  return sum;
}

function mass(value: number): string {
  return formatDecimal(value, 3);
}

function percent(value: number): string {
  return formatDecimal(value, 2);
}
