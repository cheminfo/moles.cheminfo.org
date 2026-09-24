/**
 * The compounds a mass-percent question is drawn from. The composition is
 * computed from the formula, never stored.
 *
 * Language-free: the names a question shows live in `locales/`.
 */
export const PERCENT_FORMULAS: readonly string[] = [
  'C25H30N3Cl',
  'KAl(SO4)2',
  'Br2',
  'C',
  'C10H12O2',
  'C10H14N2',
  'C10H14O',
  'C11H15NO2',
  'C13H18O2',
  'C16H10N2O2',
  'C16H8Br2N2O2',
  'C16H9N4Na3O9S2',
  'C17H21NO4',
  'C27H46O',
  'C2H4O2',
  'C2H5OH',
  'C3H6O3',
  'C3H7NO2',
  'C3H7NO2S',
  'C43H66N12O12S2',
  'C4H5N3O',
  'C5H5N5',
  'C5H5N5O',
  'C5H6N2O2',
  'C60',
  'C6H12O6',
  'C8H8O3',
  'C9H8O4',
  'CH4N2O',
  'CHCl3',
  'CaC2',
  'CaCO3',
  'Cl2',
  'CuSO4',
  'Fe2O3',
  'FeCl3',
  'FeO',
  'FeS2',
  'H2C2O4',
  'H2O',
  'H2O2',
  'H2S',
  'H3NSO3',
  'H3PO4',
  'I2',
  'K2Cr2O7',
  'K2HPO4',
  'K2O2',
  'KH2PO4',
  'KI',
  'Mg',
  'MgSO4.H2O',
  'NH3',
  'Na2S2O3',
  'NaCl',
  'NaHCO3',
  'NaOH',
  'P4',
  'PbCrO4',
  'S8',
  'SiO2',
  'Xe',
];

/** A sample of a compound, for a question about the mass of each element in it. */
export interface Sample {
  formula: string;
  /** The mass of the sample, in grams. */
  grams: number;
}

/**
 * The samples a mass-in-grams question is drawn from.
 *
 * Language-free: the names a question shows live in `locales/`.
 */
export const SAMPLES: readonly Sample[] = [
  { formula: 'Al2O3', grams: 20 },
  { formula: 'Sb2O5', grams: 5 },
  { formula: 'Ag2O', grams: 100 },
  { formula: 'BaO', grams: 10 },
  { formula: 'C', grams: 5 },
  { formula: 'BeO', grams: 1 },
  { formula: 'Bi2O5', grams: 1 },
];
