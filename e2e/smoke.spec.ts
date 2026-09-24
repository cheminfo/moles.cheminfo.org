import { expect, test } from '@playwright/test';

const PAGES = [
  { path: '/', heading: 'Balance a chemical reaction' },
  { path: '/percent', heading: 'Mass percent composition' },
  { path: '/grams', heading: 'Mass of each element in a sample' },
  { path: '/cheatsheet', heading: 'The rules on one page' },
];

for (const { path, heading } of PAGES) {
  test(`${path} opens on its tool, with no error in the console`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    await page.goto(path);
    await expect(
      page.getByRole('heading', { level: 1, name: heading, exact: true }),
    ).toBeVisible();
    expect(errors).toStrictEqual([]);
  });
}

test('the bar moves between the tools, and the address follows', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Mass %', exact: true }).click();
  await expect(page).toHaveURL(/\/percent\?seed=\d+$/);
  await expect(page).toHaveTitle(
    'Mass percent composition of a compound — moles.cheminfo.org',
  );
  await page.goBack();
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'Balance a chemical reaction',
    }),
  ).toBeVisible();
});
