import type { ExerciseLevel } from 'react-cheminfo/core';
import { finishValidation } from 'react-cheminfo/core';

import type { Reaction } from '../chemistry/balance.ts';
import { balanceReaction, sideTotals } from '../chemistry/balance.ts';
import { atomCounts, formulaText, readFormula } from '../chemistry/formula.ts';
import { gcd } from '../chemistry/rational.ts';
import { REACTIONS } from '../data/reactions.ts';
import { parseInteger } from '../exercises/answers.ts';
import { emptyCase, unreadableCase } from '../exercises/cases.ts';
import type {
  AnswerCheck,
  AnswerField,
  Answers,
  FieldCase,
  SeriesTool,
} from '../exercises/types.ts';

/** Balance a reaction with the smallest whole coefficients. */
export const BALANCE_TOOL: SeriesTool<Reaction> = {
  id: 'balance',
  pool: REACTIONS,
  key: reactionKey,
  level: reactionLevel,
  fields: balanceFields,
  grade: gradeBalance,
  hints: balanceHints,
  solution: balanceSolution,
};

/**
 * A reaction written on one line, as a key and as plain text.
 * @param reaction - The reaction.
 * @returns E.g. `H2 + O2 -> H2O`.
 */
export function reactionKey(reaction: Reaction): string {
  return `${reaction.reactants.join(' + ')} -> ${reaction.products.join(' + ')}`;
}

/**
 * How hard a reaction is to balance, by how many species it has.
 * @param reaction - The reaction.
 * @returns Beginner up to three species, intermediate at four, advanced above.
 */
export function reactionLevel(reaction: Reaction): ExerciseLevel {
  const species = reaction.reactants.length + reaction.products.length;
  if (species <= 3) return 'beginner';
  if (species === 4) return 'intermediate';
  return 'advanced';
}

/**
 * One box per species, reactants first.
 * @param reaction - The reaction.
 * @returns The boxes, keyed by position.
 */
export function balanceFields(reaction: Reaction): AnswerField[] {
  return [...reaction.reactants, ...reaction.products].map(
    (formula, index) => ({
      key: fieldKey(index),
      label: formulaText(formula),
    }),
  );
}

/**
 * Grade the coefficients: one case per element — as many on each side? — and
 * one for the smallest whole numbers.
 * @param reaction - The reaction.
 * @param answers - The coefficients typed, keyed by position.
 * @returns The cases.
 */
export function gradeBalance(
  reaction: Reaction,
  answers: Answers,
): AnswerCheck {
  const fields = balanceFields(reaction);
  const coefficients: number[] = [];
  const problems: FieldCase[] = [];
  for (const field of fields) {
    const typed = answers[field.key] ?? '';
    if (typed.trim() === '') {
      problems.push(emptyCase(field.label, 'a coefficient, a 1 included'));
      continue;
    }
    const value = parseInteger(typed);
    if (value === null || value <= 0) {
      problems.push(
        unreadableCase(field.label, typed, 'a whole number greater than zero'),
      );
      continue;
    }
    coefficients.push(value);
  }
  if (problems.length > 0) return finishValidation(problems);

  const cases: FieldCase[] = sideTotals(reaction, coefficients).map((line) => {
    const label = line.label === 'charge' ? 'Charge' : line.label;
    const passed = line.left === line.right;
    return {
      label,
      passed,
      reason: passed
        ? `${line.left} on each side.`
        : `${line.left} on the left, ${line.right} on the right.`,
      actual: `${line.left} → ${line.right}`,
    };
  });

  let common = 0n;
  for (const value of coefficients) common = gcd(common, BigInt(value));
  const divisor = Number(common);
  cases.push({
    label: 'Smallest whole numbers',
    passed: divisor === 1,
    reason:
      divisor === 1
        ? 'The coefficients share no common factor.'
        : `Every coefficient divides by ${divisor}: divide them all by ${divisor}.`,
    actual: coefficients.join(', '),
  });
  return finishValidation(cases);
}

/**
 * Hints for a balancing question, from the method to two coefficients.
 * @param reaction - The reaction.
 * @returns Three hints.
 */
export function balanceHints(reaction: Reaction): string[] {
  const coefficients = expectedCoefficients(reaction);
  const species = [...reaction.reactants, ...reaction.products];
  const given = species
    .slice(0, 2)
    .map(
      (formula, index) => `${coefficients[index] ?? 1} ${formulaText(formula)}`,
    )
    .join(' and ');
  return [
    'Count the atoms of each element on both sides. A [[coefficient]] multiplies every atom of its formula; an index only the atom it follows.',
    startingElementHint(reaction),
    `The balanced reaction starts with ${given}.`,
  ];
}

/**
 * The balanced reaction.
 * @param reaction - The reaction.
 * @returns The equation with its coefficients, a 1 left unwritten.
 */
export function balanceSolution(reaction: Reaction): string {
  return `**${balancedEquation(reaction, expectedCoefficients(reaction))}**`;
}

/**
 * Write a reaction with its coefficients, the way a chemist writes it.
 * @param reaction - The reaction.
 * @param coefficients - One per species, reactants first.
 * @returns E.g. `2 H₂ + O₂ → 2 H₂O`.
 */
export function balancedEquation(
  reaction: Reaction,
  coefficients: readonly number[],
): string {
  const term = (formula: string, index: number): string => {
    const coefficient = coefficients[index] ?? 1;
    const written = formulaText(formula);
    return coefficient === 1 ? written : `${coefficient} ${written}`;
  };
  const left = reaction.reactants.map((formula, index) => term(formula, index));
  const offset = reaction.reactants.length;
  const right = reaction.products.map((formula, index) =>
    term(formula, offset + index),
  );
  return `${left.join(' + ')} → ${right.join(' + ')}`;
}

function expectedCoefficients(reaction: Reaction): number[] {
  const result = balanceReaction(reaction);
  if (!result.ok) {
    throw new Error(`${reactionKey(reaction)}: ${result.message}`);
  }
  return result.coefficients;
}

function startingElementHint(reaction: Reaction): string {
  const inReactants = elementOccurrences(reaction.reactants);
  const inProducts = elementOccurrences(reaction.products);
  for (const [symbol, count] of inReactants) {
    if (symbol === 'H' || symbol === 'O') continue;
    if (count === 1 && inProducts.get(symbol) === 1) {
      return `Start with ${symbol}: it is in a single formula on each side. Leave H and O, found in many formulas, for last.`;
    }
  }
  return 'Start with the element found in the fewest formulas, and leave H and O for last.';
}

function elementOccurrences(formulas: readonly string[]): Map<string, number> {
  const occurrences = new Map<string, number>();
  for (const formula of formulas) {
    for (const symbol of atomCounts(readFormula(formula)).keys()) {
      occurrences.set(symbol, (occurrences.get(symbol) ?? 0) + 1);
    }
  }
  return occurrences;
}

function fieldKey(index: number): string {
  return `species${index}`;
}
