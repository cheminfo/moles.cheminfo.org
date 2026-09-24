import type { ReferenceSection } from 'react-cheminfo/ui';

/** The rules the tools apply, one section per tool, as the cheatsheet prints them. */
export const CHEATSHEET: readonly ReferenceSection[] = [
  {
    id: 'balance',
    title: 'Balancing a reaction',
    rows: [
      {
        syntax: 'a A + b B → c C',
        description:
          'Coefficients a, b, c: how many of each formula take part.',
      },
      {
        syntax: 'Σ left = Σ right',
        description: 'Every element counts as many atoms on each side.',
      },
      {
        syntax: 'charge',
        description:
          'With ions, the charges add up to the same on each side too.',
      },
      {
        syntax: 'H and O last',
        description: 'Start with an element found in one formula on each side.',
      },
      {
        syntax: '2 H₂ + O₂ → 2 H₂O',
        description: 'The smallest whole numbers; a 1 is left unwritten.',
      },
    ],
  },
  {
    id: 'mole',
    title: 'The mole and the molar mass',
    rows: [
      {
        syntax: 'N_A = 6.022 × 10²³',
        description: 'Entities in one mole: the Avogadro number.',
      },
      {
        syntax: 'M = Σ nᵢ · Mᵢ',
        description: 'Molar mass: the atomic masses of the atoms, added up.',
      },
      {
        syntax: 'n = m / M',
        description: 'Amount in moles from a mass in grams.',
      },
    ],
  },
  {
    id: 'composition',
    title: 'Mass composition',
    rows: [
      {
        syntax: 'w = n · Mᵢ / M',
        description:
          'Mass fraction of an element: what it brings over the molar mass.',
      },
      {
        syntax: 'w × 100 %',
        description:
          'Mass percent; the percents of a compound add up to 100 %.',
      },
      {
        syntax: 'mᵢ = w · m',
        description: 'Mass of an element in a sample of mass m.',
      },
      {
        syntax: 'n / Σ n',
        description: 'The share of the atoms: not the mass percent.',
      },
    ],
  },
];
