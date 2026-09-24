import { expect, test } from '@playwright/test';

import { balanceReaction } from '../src/chemistry/balance.ts';
import { REACTIONS } from '../src/data/reactions.ts';
import { pickSeeded } from '../src/exercises/seed.ts';

const SEED = 42;
const [FIRST] = pickSeeded(REACTIONS, 10, SEED);

test('a balanced answer solves the question, a wrong one names the element', async ({
  page,
}) => {
  if (FIRST === undefined) throw new Error('the pool is empty');
  const result = balanceReaction(FIRST);
  if (!result.ok) throw new Error(result.message);
  await page.goto(`/?seed=${SEED}`);
  const card = page.getByRole('article');
  const boxes = card.getByRole('textbox');
  await expect(boxes).toHaveCount(result.coefficients.length);

  for (const [index, value] of result.coefficients.entries()) {
    await boxes.nth(index).fill(String(value + (index === 0 ? 1 : 0)));
  }
  await card.getByRole('button', { name: 'Check' }).click();
  await expect(
    card.getByText(/on the left, \d+ on the right\./).first(),
  ).toBeVisible();

  await boxes.first().fill(String(result.coefficients[0]));
  await boxes.first().press('Enter');
  await expect(
    card.getByText('The coefficients share no common factor.'),
  ).toBeVisible();
  await expect(page.getByText('1 / 10 solved')).toBeVisible();
});

test('the calculator balances any reaction typed into it', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Reactants').fill('Al + O2');
  await page.getByLabel('Products').fill('Al2O3');
  await expect(page.locator('.calculator__result')).toHaveText(
    '4Al+3O2→2Al2O3',
  );
  await page.getByLabel('Products').fill('H2O');
  await expect(
    page.getByText(
      'No coefficients balance these formulas: check the species.',
    ),
  ).toBeVisible();
});

test('the mass composition of aspirin, worked out', async ({ page }) => {
  await page.goto('/percent');
  await expect(page.locator('.calculator__total td').first()).toHaveText(
    '180.158',
  );
  await page.getByLabel('Formula').fill('H2O');
  await expect(page.getByRole('row', { name: /^H 2/ })).toContainText('11.19');
});

test('the mass of each element in a sample', async ({ page }) => {
  await page.goto('/grams');
  await expect(page.getByRole('row', { name: /^Al/ })).toContainText('10.585');
});

test('a computed value is copied by clicking it', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/percent');
  await page.getByLabel('Formula').fill('H2O');
  await page.locator('.calculator__total td').first().click();
  await expect
    .poll(async () => page.evaluate(() => navigator.clipboard.readText()))
    .toBe('18.015');
});
