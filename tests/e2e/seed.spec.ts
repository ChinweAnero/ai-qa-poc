
import { test, expect } from '@playwright/test';

test('seed: SauceDemo login page is accessible', async ({
  page,
}) => {
  await page.goto('/');

  await expect(
    page.locator('[data-test="username"]')
  ).toBeVisible();

  await expect(
    page.locator('[data-test="password"]')
  ).toBeVisible();

  await expect(
    page.locator('[data-test="login-button"]')
  ).toBeVisible();
});
