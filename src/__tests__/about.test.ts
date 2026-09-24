import { aboutProblems } from 'react-cheminfo/core';
import { expect, test } from 'vitest';

import { ABOUT } from '../about.ts';

test('the About record says what the family checks it says', () => {
  expect(aboutProblems(ABOUT)).toStrictEqual([]);
});

test('the platform paper is cited first', () => {
  expect(ABOUT.cite?.map((work) => work.reference.doi)).toStrictEqual([
    '10.2533/chimia.2025.66',
    '10.2533/chimia.2023.683',
  ]);
});
