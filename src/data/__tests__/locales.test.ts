import { expect, test } from 'vitest';

import { PERCENT_FORMULAS, SAMPLES } from '../composition.ts';
import { NAMES_EN } from '../locales/en.ts';
import { NAMES_FR } from '../locales/fr.ts';

const POOLS = {
  percent: PERCENT_FORMULAS,
  samples: SAMPLES.map((sample) => sample.formula),
};

test('every compound of every pool is named in English and in French', () => {
  for (const [tool, formulas] of Object.entries(POOLS)) {
    const key = tool as keyof typeof POOLS;
    expect({ tool, en: Object.keys(NAMES_EN[key]) }).toStrictEqual({
      tool,
      en: [...formulas],
    });
    expect({ tool, fr: Object.keys(NAMES_FR[key]) }).toStrictEqual({
      tool,
      fr: [...formulas],
    });
  }
});
