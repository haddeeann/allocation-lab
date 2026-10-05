import { expect, test } from '@playwright/test';

async function allocationDollars(
  page: import('@playwright/test').Page,
  organizationId: string,
) {
  const value = await page
    .getByTestId(`allocation-${organizationId}`)
    .getAttribute('data-dollars');

  return Number(value);
}

async function setSliderWithKeyboard(
  slider: import('@playwright/test').Locator,
  key: 'ArrowUp' | 'ArrowDown',
  expectedValue: string,
) {
  await expect(async () => {
    if ((await slider.getAttribute('aria-valuenow')) !== expectedValue) {
      await slider.focus();
      await slider.press(key);
    }
    await expect(slider).toHaveAttribute('aria-valuenow', expectedValue, {
      timeout: 500,
    });
  }).toPass({ timeout: 5_000 });
}

test('raising an evaluator weight changes the recommendation and explains why', async ({
  page,
}) => {
  await page.goto('/');

  const baseline = await allocationDollars(page, 'harbor');
  const weight = page.getByRole('slider', {
    name: 'Harbor Health evaluator weight',
  });

  await setSliderWithKeyboard(weight, 'ArrowUp', '1.3');

  await expect(page.getByText('1.3×')).toBeVisible();
  await expect
    .poll(() => allocationDollars(page, 'harbor'))
    .toBeGreaterThan(baseline);
  await expect(page.getByText(/more evaluator weight lifts its whole curve/i)).toBeVisible();
});

test('reset restores the baseline allocation', async ({ page }) => {
  await page.goto('/');

  const baseline = await allocationDollars(page, 'brightpath');
  const marginalUtility = page.getByRole('slider', {
    name: 'BrightPath Learning starting marginal utility',
  });

  await setSliderWithKeyboard(marginalUtility, 'ArrowDown', '105');
  await expect
    .poll(() => allocationDollars(page, 'brightpath'))
    .not.toBe(baseline);

  await page.getByRole('button', { name: 'Reset all assumptions' }).click();
  await expect.poll(() => allocationDollars(page, 'brightpath')).toBeCloseTo(baseline, 6);
  await expect(page.getByText(/retains value longest/i)).toBeVisible();
});

test('shows the complete analytical result', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Allocation Lab/);
  await expect(page.getByText('$1,000,000')).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Value produced as funding grows' }),
  ).toBeVisible();

  const allocations = await Promise.all(
    ['harbor', 'brightpath', 'commonfield'].map((id) => allocationDollars(page, id)),
  );
  expect(allocations.reduce((sum, value) => sum + value, 0)).toBeCloseTo(
    1_000_000,
    6,
  );
});
