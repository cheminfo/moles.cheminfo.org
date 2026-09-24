import { MF } from 'mf-parser';

import type { ParsedFormula } from './formula.ts';
import { atomCounts, normalizeFormula, readFormula } from './formula.ts';

/** What one element brings to a mole of a compound. */
export interface ElementShare {
  symbol: string;
  /** Atoms of it in the formula. */
  count: number;
  /** Its standard atomic mass, in g/mol. */
  atomicMass: number;
  /** `count × atomicMass`: the mass it brings to one mole, in g/mol. */
  mass: number;
  /** Its share of the molar mass, in percent. */
  percent: number;
  /** Its share of the atoms, in percent: not the mass composition. */
  atomPercent: number;
}

/** The mass composition of a compound, element by element. */
export interface Composition {
  parsed: ParsedFormula;
  /** The molar mass, in g/mol. */
  molarMass: number;
  /** One entry per element, in the order the formula first names them. */
  elements: ElementShare[];
}

/**
 * The mass composition of a compound: what each element brings to one mole of
 * it, and its share of the molar mass. The masses are the standard atomic
 * masses of mass-tools.
 * @param text - A formula, e.g. `CaCO3` or `CuSO4.5H2O`.
 * @returns The molar mass and the share of each element.
 * @throws {FormulaError} When the text is not a formula.
 */
export function massComposition(text: string): Composition {
  const parsed = readFormula(text);
  const analysis = new MF(normalizeFormula(text)).getEA();
  const massBySymbol = new Map<string, number>();
  let molarMass = 0;
  for (const entry of analysis) {
    massBySymbol.set(entry.element, entry.mass);
    molarMass += entry.mass;
  }
  const counts = atomCounts(parsed);
  let atoms = 0;
  for (const count of counts.values()) atoms += count;

  const elements: ElementShare[] = [];
  for (const [symbol, count] of counts) {
    const mass = massBySymbol.get(symbol) ?? 0;
    elements.push({
      symbol,
      count,
      atomicMass: mass / count,
      mass,
      percent: (mass / molarMass) * 100,
      atomPercent: (count / atoms) * 100,
    });
  }
  return { parsed, molarMass, elements };
}
