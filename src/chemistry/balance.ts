import type { ParsedFormula } from './formula.ts';
import { atomCounts, readFormula } from './formula.ts';
import type { Rational } from './rational.ts';
import {
  ZERO,
  divide,
  fromInteger,
  gcd,
  lcm,
  multiply,
  subtract,
} from './rational.ts';

/** A reaction as typed: the formulas on each side. */
export interface Reaction {
  reactants: readonly string[];
  products: readonly string[];
}

/** A balanced reaction: the smallest whole coefficients, reactants first. */
export interface BalancedReaction {
  ok: true;
  coefficients: number[];
}

/** Why a reaction has no single balanced form. */
export interface UnbalancedReaction {
  ok: false;
  reason: 'too-few-species' | 'unbalanceable' | 'not-unique' | 'negative';
  message: string;
}

/** What balancing a reaction gives. */
export type BalanceResult = BalancedReaction | UnbalancedReaction;

/** How one element — or the charge — stands on the two sides. */
export interface SideTotals {
  /** An element symbol, or `charge`. */
  label: string;
  left: number;
  right: number;
}

/**
 * Split one side of a reaction, `C8H18 + O2`, into its formulas.
 *
 * A `+` separates two species when it stands outside every bracket and either
 * follows a space or is followed by the start of a formula; one ending a
 * formula, as in `Na+ + Cl-`, is a charge.
 * @param side - One side of the reaction, as typed.
 * @returns The formulas, trimmed.
 */
export function splitSide(side: string): string[] {
  const species: string[] = [];
  let depth = 0;
  let current = '';
  for (let index = 0; index < side.length; index++) {
    const character = side[index] ?? '';
    if (character === '(' || character === '[') depth++;
    if (character === ')' || character === ']') depth--;
    if (character === '+' && depth === 0) {
      const before = side[index - 1] ?? ' ';
      const after = side[index + 1] ?? '';
      if (/\s/u.test(before) || /[A-Z([\d]/u.test(after)) {
        species.push(current);
        current = '';
        continue;
      }
    }
    current += character;
  }
  species.push(current);
  return species.map((formula) => formula.trim()).filter(Boolean);
}

/**
 * Balance a reaction exactly.
 *
 * The matrix holds one row per element and one for the charge, one column per
 * species, the products negated. It is reduced over exact rationals, so no
 * coefficient is ever off by a rounding error; a balanced reaction is a vector
 * of its null space, scaled by the least common multiple of its denominators
 * and divided by the greatest common divisor of the result, which leaves the
 * smallest whole numbers.
 * @param reaction - The formulas on each side.
 * @returns The coefficients, or why there is no single balanced form.
 * @throws {FormulaError} When a formula cannot be read.
 */
export function balanceReaction(reaction: Reaction): BalanceResult {
  const species = [...reaction.reactants, ...reaction.products];
  if (reaction.reactants.length === 0 || reaction.products.length === 0) {
    return {
      ok: false,
      reason: 'too-few-species',
      message: 'A reaction needs at least one reactant and one product.',
    };
  }
  const parsed = species.map((formula) => readFormula(formula));
  const rows = matrixRows(parsed);
  const columns = species.length;
  const matrix = rows.map((row) =>
    row.map((value, column) =>
      fromInteger(column < reaction.reactants.length ? value : -value),
    ),
  );

  const pivots = reduce(matrix, columns);
  const pivotColumns = new Set(pivots);
  const free: number[] = [];
  for (let column = 0; column < columns; column++) {
    if (!pivotColumns.has(column)) free.push(column);
  }
  if (free.length === 0) {
    return {
      ok: false,
      reason: 'unbalanceable',
      message: 'No coefficients balance these formulas: check the species.',
    };
  }
  if (free.length > 1) {
    return {
      ok: false,
      reason: 'not-unique',
      message:
        'These species balance in more than one independent way: the reaction is two reactions written as one.',
    };
  }

  const [freeColumn = 0] = free;
  const solution = new Array<Rational>(columns).fill(ZERO);
  solution[freeColumn] = fromInteger(1);
  for (const [row, column] of pivots.entries()) {
    const value = matrix[row]?.[freeColumn] ?? ZERO;
    solution[column] = subtract(ZERO, value);
  }

  let denominator = 1n;
  for (const value of solution) {
    denominator = lcm(denominator, value.denominator);
  }
  const whole = solution.map(
    (value) => (value.numerator * denominator) / value.denominator,
  );
  let divisor = 0n;
  for (const value of whole) divisor = gcd(divisor, value);
  let scaled = whole.map((value) => value / divisor);
  if (scaled.some((value) => value < 0n)) {
    scaled = scaled.map((value) => -value);
  }
  if (scaled.some((value) => value <= 0n)) {
    return {
      ok: false,
      reason: 'negative',
      message:
        'The only balance puts a species on the wrong side: move it across.',
    };
  }
  return { ok: true, coefficients: scaled.map(Number) };
}

/**
 * Count every element, and the charge, on each side for given coefficients.
 * @param reaction - The formulas on each side.
 * @param coefficients - One per species, reactants first.
 * @returns One line per element in the order they first appear, then the
 * charge when any species carries one.
 */
export function sideTotals(
  reaction: Reaction,
  coefficients: readonly number[],
): SideTotals[] {
  const totals = new Map<string, SideTotals>();
  let charged = false;
  const species = [...reaction.reactants, ...reaction.products];
  for (const [index, formula] of species.entries()) {
    const parsed = readFormula(formula);
    const factor = coefficients[index] ?? 0;
    const onLeft = index < reaction.reactants.length;
    const entries: Array<[string, number]> = [...atomCounts(parsed)];
    if (parsed.charge !== 0) charged = true;
    entries.push(['charge', parsed.charge]);
    for (const [label, count] of entries) {
      const line = totals.get(label) ?? { label, left: 0, right: 0 };
      if (onLeft) line.left += factor * count;
      else line.right += factor * count;
      totals.set(label, line);
    }
  }
  const lines = [...totals.values()].filter((line) => line.label !== 'charge');
  const charge = totals.get('charge');
  if (charged && charge !== undefined) lines.push(charge);
  return lines;
}

function matrixRows(parsed: readonly ParsedFormula[]): number[][] {
  const symbols = new Set<string>();
  const counts = parsed.map((formula) => atomCounts(formula));
  for (const count of counts) {
    for (const symbol of count.keys()) symbols.add(symbol);
  }
  const rows = [...symbols].map((symbol) =>
    counts.map((count) => count.get(symbol) ?? 0),
  );
  rows.push(parsed.map((formula) => formula.charge));
  return rows;
}

/**
 * Reduce a matrix to reduced row echelon form, in place.
 * @param matrix - Rows of exact rationals.
 * @param columns - Its number of columns.
 * @returns The pivot column of each row that has one.
 */
function reduce(matrix: Rational[][], columns: number): number[] {
  const pivots: number[] = [];
  let row = 0;
  for (let column = 0; column < columns && row < matrix.length; column++) {
    let pivot = -1;
    for (let candidate = row; candidate < matrix.length; candidate++) {
      if ((matrix[candidate]?.[column] ?? ZERO).numerator !== 0n) {
        pivot = candidate;
        break;
      }
    }
    if (pivot === -1) continue;
    const pivotRow = matrix[pivot] ?? [];
    matrix[pivot] = matrix[row] ?? [];
    matrix[row] = pivotRow;
    const head = pivotRow[column] ?? fromInteger(1);
    for (let index = 0; index < columns; index++) {
      pivotRow[index] = divide(pivotRow[index] ?? ZERO, head);
    }
    for (const [other, otherRow] of matrix.entries()) {
      if (other === row) continue;
      const factor = otherRow[column] ?? ZERO;
      if (factor.numerator === 0n) continue;
      for (let index = 0; index < columns; index++) {
        otherRow[index] = subtract(
          otherRow[index] ?? ZERO,
          multiply(factor, pivotRow[index] ?? ZERO),
        );
      }
    }
    pivots.push(column);
    row++;
  }
  return pivots;
}
