import type { Glossary } from 'react-cheminfo/core';

/**
 * The words the explanations of this site are written in, each defined in one
 * paragraph with a worked example. A `[[term]]` marker in any description,
 * hint or solution opens the entry it names; keys are the lowercased marker.
 */
export const GLOSSARY: Glossary = {
  coefficient: {
    title: 'Stoichiometric coefficient',
    summary:
      'The number written before a formula in a reaction: how many of that formula take part. It multiplies every atom of the formula; a 1 is left unwritten.',
    examples: [
      { code: '2 H₂ + O₂ → 2 H₂O', note: 'Four H and two O on each side.' },
      { code: '3 H₂O', note: 'Six H and three O.' },
    ],
  },
  mole: {
    title: 'Mole',
    summary:
      'The amount of substance holding as many entities as there are atoms in 12 g of carbon-12: 6.022 × 10²³ of them, the Avogadro number.',
    examples: [
      { code: '1 mol H₂O', note: '6.022 × 10²³ molecules, weighing 18.015 g.' },
    ],
  },
  'molar mass': {
    title: 'Molar mass (M)',
    summary:
      'The mass of one mole of a substance, in g/mol: the atomic masses of its atoms added up.',
    examples: [
      { code: 'M(H₂O)', note: '2 × 1.008 + 15.999 = 18.015 g/mol.' },
      {
        code: 'M(CaCO₃)',
        note: '40.078 + 12.011 + 3 × 15.999 = 100.087 g/mol.',
      },
    ],
  },
  'mass percent': {
    title: 'Mass percent',
    summary:
      'The share of the mass of a compound one element accounts for: the mass it brings to one mole, divided by the molar mass. The mass percents of a compound add up to 100 %.',
    examples: [
      {
        code: 'H in H₂O',
        note: '2.016 / 18.015 = 11.19 %, although two atoms in three are H.',
      },
      { code: 'Fe in Fe₂O₃', note: '111.69 / 159.69 = 69.94 %.' },
    ],
  },
};
