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

test('raising an evaluator score changes the recommendation and explains why', async ({
  page,
}) => {
  await page.goto('/');

  const baseline = await allocationDollars(page, 'harbor');
  const weight = page.getByRole('slider', {
    name: 'Alice score for Harbor Health',
  });

  await setSliderWithKeyboard(weight, 'ArrowUp', '1.6');

  await expect(page.getByText('Combined 1.25×')).toBeVisible();
  await expect
    .poll(() => allocationDollars(page, 'harbor'))
    .toBeGreaterThan(baseline);
  await expect(
    page.getByText(/higher combined evaluator score/i),
  ).toBeVisible();
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
  await expect
    .poll(() => allocationDollars(page, 'brightpath'))
    .toBeCloseTo(baseline, 6);
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
    ['harbor', 'brightpath', 'commonfield'].map((id) =>
      allocationDollars(page, id),
    ),
  );
  expect(allocations.reduce((sum, value) => sum + value, 0)).toBeCloseTo(
    1_000_000,
    6,
  );
});

test('the in-app tour demonstrates how an assumption changes an allocation', async ({
  page,
}) => {
  await page.goto('/');

  const guide = page.getByRole('region', {
    name: 'Follow the next best dollar.',
  });
  await expect(async () => {
    if (!(await guide.isVisible())) {
      await page.getByRole('button', { name: 'How to use' }).click();
    }
    await expect(guide).toBeVisible({ timeout: 500 });
  }).toPass({ timeout: 5_000 });

  const baseline = await allocationDollars(page, 'commonfield');
  const bobInfluence = page.getByTestId('bob-influence');
  await expect(async () => {
    if ((await bobInfluence.getAttribute('data-percentage')) !== '80') {
      await guide.getByRole('button', { name: 'Try the example' }).click();
    }
    await expect(bobInfluence).toHaveAttribute('data-percentage', '80', {
      timeout: 500,
    });
  }).toPass({ timeout: 5_000 });

  await expect(page.getByText(/Bob now has 80% influence/i)).toBeVisible();
  await expect
    .poll(() => allocationDollars(page, 'commonfield'))
    .toBeGreaterThan(baseline);

  await page.getByRole('button', { name: 'Hide guide' }).click();
  await expect(guide).toBeHidden();
  await page.getByRole('button', { name: 'How to use' }).click();
  await expect(guide).toBeVisible();

  await guide.getByRole('button', { name: 'Restore baseline' }).click();
  await expect
    .poll(() => allocationDollars(page, 'commonfield'))
    .toBeCloseTo(baseline, 6);
});

test('switches between decision scenarios with scenario-specific units and options', async ({
  page,
}) => {
  await page.goto('/team-time');

  await expect(
    page.getByRole('heading', {
      name: 'Put the team’s next hour where it matters most.',
    }),
  ).toBeVisible();
  await expect(page.getByText('40 hours', { exact: true })).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Improve platform reliability' }),
  ).toBeVisible();

  const hours = await Promise.all(
    ['reliability', 'onboarding', 'sharing'].map((id) =>
      allocationDollars(page, id),
    ),
  );
  expect(hours.reduce((sum, value) => sum + value, 0)).toBeCloseTo(40, 8);

  await page.getByRole('link', { name: 'Risk reduction' }).click();
  await expect(page).toHaveURL(/\/risk-reduction$/);
  await expect(
    page.getByRole('heading', {
      name: 'Invest where the next dollar reduces the most risk.',
    }),
  ).toBeVisible();
  await expect(page.getByText('$500,000', { exact: true })).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Account and access security' }),
  ).toBeVisible();
});
