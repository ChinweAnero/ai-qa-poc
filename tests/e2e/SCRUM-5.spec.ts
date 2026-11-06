// spec: specs/SCRUM-5.md
// seed: tests/e2e/seed.spec.ts
// All six scenarios manually verified with Playwright MCP on 2026-11-06.
import { test, expect, type Page } from '@playwright/test';
import specification from '../specifications/SCRUM-5.json';

// Reuse the seed's observed data-test convention without changing shared config.
const byTest = (page: Page, name: string) => page.locator(`[data-test="${name}"]`);
const items = (page: Page) => byTest(page, 'inventory-item');
const names = (page: Page) => byTest(page, 'inventory-item-name');
const priceLabels = (page: Page) => byTest(page, 'inventory-item-price');
const badge = (page: Page) => byTest(page, 'shopping-cart-badge');
const sort = (page: Page) => page.getByRole('combobox', { name: 'Sort products', exact: true });

function details(id: string) {
  const scenario = specification.scenarios.find(candidate => candidate.id === id);
  if (!scenario) throw new Error(`Missing specification scenario: ${id}`);
  return {
    annotation: [
      { type: 'jira', description: specification.jiraKey },
      { type: 'scenario', description: scenario.id },
      ...scenario.acceptanceCriteria.map(description => ({ type: 'acceptance-criterion', description })),
      { type: 'source', description: scenario.source },
      { type: 'scenario-type', description: scenario.type },
      { type: 'priority', description: scenario.priority },
      ...scenario.preconditions.map(description => ({ type: 'precondition', description })),
      // Preserve the exact source expected result in the execution report.
      { type: 'expected-result', description: scenario.expectedResult },
    ],
  };
}

async function expectInventory(page: Page) {
  await expect(items(page)).toHaveCount(6);
  await expect(names(page)).toHaveCount(6);
  await expect(priceLabels(page)).toHaveCount(6);
  // A count alone cannot detect hidden products.
  for (let index = 0; index < 6; index++) {
    await expect(items(page).nth(index)).toBeVisible();
    await expect(names(page).nth(index)).toBeVisible();
    await expect(priceLabels(page).nth(index)).toBeVisible();
  }
}

async function expectSelection(page: Page, label: string, value: string) {
  await expect(sort(page)).toHaveValue(value);
  await expect(sort(page).getByRole('option', { name: label, exact: true }))
    .toHaveJSProperty('selected', true);
  await expect(byTest(page, 'active-option')).toBeVisible();
  await expect(byTest(page, 'active-option')).toHaveText(label);
}

async function expectNameOrder(page: Page, ascending: boolean) {
  const displayed = (await names(page).allTextContents()).map(name => name.trim());
  const expected = [...displayed].sort((a, b) => ascending ? a.localeCompare(b) : b.localeCompare(a));
  // The expected sequence is computed independently; the application is never reordered by the test.
  await expect(names(page)).toHaveText(expected);
  return (await names(page).allTextContents()).map(name => name.trim());
}

async function numericPrices(page: Page) {
  return (await priceLabels(page).allTextContents()).map(text => {
    const numericText = text.trim().replace(/^\$/, '');
    const value = numericText.length ? Number(numericText) : Number.NaN;
    expect(Number.isFinite(value), 'Each displayed product price must parse as a finite number').toBe(true);
    return value;
  });
}

async function expectPriceOrder(page: Page, displayed: number[], ascending: boolean) {
  const expected = [...displayed].sort((a, b) => ascending ? a - b : b - a);
  await expect.poll(() => numericPrices(page), { message: 'All displayed prices follow the required numerical order' })
    .toEqual(expected);
  const actual = await numericPrices(page);
  expect(actual[0], ascending ? 'Minimum price appears first' : 'Maximum price appears first')
    .toBe(ascending ? Math.min(...actual) : Math.max(...actual));
}

function occurrences(displayedNames: string[]) {
  const counts = new Map<string, number>();
  for (const name of displayedNames) counts.set(name, (counts.get(name) ?? 0) + 1);
  return [...counts.entries()].sort(([a], [b]) => a.localeCompare(b));
}

// Match existing credential-safe evidence conventions. Raw traces/videos can
// record login values; retain sanitized state and post-login failure images.
test.use({ trace: 'off', video: 'off', screenshot: 'off' });

test.describe('SCRUM-5: Test Product Sorting on the Inventory Page', () => {
  test.beforeEach(async ({ page }) => {
    // Every page fixture has its own fresh context and independent login/cart state.
    await page.goto('/');
    const usernameInput = page.getByRole('textbox', { name: 'Username', exact: true });
    const passwordInput = page.getByRole('textbox', { name: 'Password', exact: true });
    const loginButton = page.getByRole('button', { name: 'Login', exact: true });
    await expect(usernameInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(loginButton).toBeVisible();

    // Reuse the existing page-published demo guidance without persisting its values.
    const demoUser = (await page.locator('#login_credentials').innerText())
      .split('\n').map(value => value.trim()).find(value => value === 'standard_user');
    const demoPassword = (await page.locator('.login_password').innerText())
      .split('\n').map(value => value.trim()).filter(Boolean).at(-1);
    if (!demoUser || !demoPassword) throw new Error('Published standard demo account guidance is unavailable.');
    await usernameInput.fill(demoUser);
    await passwordInput.fill(demoPassword);
    await loginButton.click();
    await expect(page).toHaveURL(new URL('/inventory.html', specification.applicationUrl).href);
    await expect(byTest(page, 'title')).toHaveText('Products');
    await expect(byTest(page, 'inventory-list')).toBeVisible();
    await expect(badge(page)).toHaveCount(0);
    await expectInventory(page);
    // Do not navigate to the cart or change sorting before S01's default checks.
  });

  test.afterEach(async ({ page }, info) => {
    if (page.isClosed()) return;
    const currentUrl = new URL(page.url());
    const safePage = currentUrl.origin === new URL(specification.applicationUrl).origin
      && ['/inventory.html', '/cart.html'].includes(currentUrl.pathname)
      && await byTest(page, 'username').count() === 0
      && await byTest(page, 'password').count() === 0;
    await info.attach('sanitized-final-state', {
      body: JSON.stringify({
        scenario: info.annotations.find(annotation => annotation.type === 'scenario')?.description,
        pathname: currentUrl.pathname,
        status: info.status,
        ...(safePage ? {
          productCount: await items(page).count(),
          productNames: await names(page).allTextContents(),
          priceTexts: await priceLabels(page).allTextContents(),
          selectedSortValues: await sort(page).evaluateAll(elements =>
            elements.map(element => (element as HTMLSelectElement).value)),
          activeSortLabels: await byTest(page, 'active-option').allTextContents(),
          badgeTexts: await badge(page).allTextContents(),
          cartQuantities: await byTest(page, 'item-quantity').allTextContents(),
        } : { evidenceScope: 'Route only; login content and form values excluded.' }),
      }, null, 2),
      contentType: 'application/json',
    });
    if (safePage && info.status !== info.expectedStatus) {
      await info.attach('post-login-failure', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });
    }
  });

  test('SCRUM-5-S01 [AC1]: Default inventory order is Name (A to Z) after login', details('SCRUM-5-S01'), async ({ page }) => {
    // 1. View the inventory page immediately after successful login without changing the sorting option.
    await expect(byTest(page, 'title')).toHaveText('Products');
    // 2. Verify that all six inventory products are visible.
    await expectInventory(page);
    // 3. Verify that the sorting dropdown displays Name (A to Z).
    await expectSelection(page, 'Name (A to Z)', 'az');
    // 4. Extract the displayed product names in their current order and compare them with an independently alphabetically ascending sorted copy; do not hardcode the expected product sequence.
    await expectNameOrder(page, true);
  });

  test('SCRUM-5-S02 [AC2]: Sort all inventory products by name from Z to A', details('SCRUM-5-S02'), async ({ page }) => {
    // 1. Select Name (Z to A) from the sorting dropdown.
    await sort(page).selectOption({ label: 'Name (Z to A)' });
    // 2. Verify that the sorting dropdown displays Name (Z to A) and that all six products remain visible.
    await expectSelection(page, 'Name (Z to A)', 'za');
    await expectInventory(page);
    // 3. Extract the displayed product names in their current order and compare them with an independently alphabetically descending sorted copy; do not hardcode the expected product sequence.
    await expectNameOrder(page, false);
  });

  test('SCRUM-5-S03 [AC3]: Sort inventory prices from low to high with the minimum first', details('SCRUM-5-S03'), async ({ page }) => {
    // 1. Select Price (low to high) from the sorting dropdown.
    await sort(page).selectOption({ label: 'Price (low to high)' });
    // 2. Verify that the sorting dropdown displays Price (low to high) and that all six products remain visible.
    await expectSelection(page, 'Price (low to high)', 'lohi');
    await expectInventory(page);
    // 3. Extract the displayed product prices in their current order and parse them into numerical values.
    const prices = await numericPrices(page);
    // 4. Compare the numerical prices with an independently numerically ascending sorted copy and verify that the first product has the minimum price; do not hardcode the expected price sequence.
    await expectPriceOrder(page, prices, true);
  });

  test('SCRUM-5-S04 [AC4]: Sort inventory prices from high to low with the maximum first', details('SCRUM-5-S04'), async ({ page }) => {
    // 1. Select Price (high to low) from the sorting dropdown.
    await sort(page).selectOption({ label: 'Price (high to low)' });
    // 2. Verify that the sorting dropdown displays Price (high to low) and that all six products remain visible.
    await expectSelection(page, 'Price (high to low)', 'hilo');
    await expectInventory(page);
    // 3. Extract the displayed product prices in their current order and parse them into numerical values.
    const prices = await numericPrices(page);
    // 4. Compare the numerical prices with an independently numerically descending sorted copy and verify that the first product has the maximum price; do not hardcode the expected price sequence.
    await expectPriceOrder(page, prices, false);
  });

  test('SCRUM-5-S05 [AC4, AC5]: Switch from descending price to ascending name without losing or duplicating products', details('SCRUM-5-S05'), async ({ page }) => {
    // 1. Record the six displayed product names and their occurrence counts before changing the sort option.
    const initialNames = (await names(page).allTextContents()).map(name => name.trim());
    const initialOccurrences = occurrences(initialNames);
    // 2. Select Price (high to low) and verify that the dropdown displays Price (high to low).
    await sort(page).selectOption({ label: 'Price (high to low)' });
    await expectSelection(page, 'Price (high to low)', 'hilo');
    // 3. Verify that all six products remain visible; parse their prices into numbers and compare their order with an independently numerically descending sorted copy, including the maximum price first.
    await expectInventory(page);
    await expectPriceOrder(page, await numericPrices(page), false);
    // 4. Subsequently select Name (A to Z) and verify that the dropdown displays Name (A to Z).
    await sort(page).selectOption({ label: 'Name (A to Z)' });
    await expectSelection(page, 'Name (A to Z)', 'az');
    // 5. Verify that all six products remain visible and compare their names with an independently alphabetically ascending sorted copy.
    await expectInventory(page);
    const finalNames = await expectNameOrder(page, true);
    // 6. Compare the final product names and occurrence counts with the recorded initial inventory to detect removed or duplicated products; do not hardcode the expected product or price sequences.
    expect(occurrences(finalNames), 'Every original product retains its occurrence count').toEqual(initialOccurrences);
  });

  test('SCRUM-5-S06 [AC3, AC6]: Sorting by ascending price preserves the single backpack in the cart', details('SCRUM-5-S06'), async ({ page }) => {
    // 1. Add Sauce Labs Backpack to the initially empty shopping cart using the application's supported action and verify that the cart badge displays 1.
    const backpack = items(page).filter({ has: page.getByText('Sauce Labs Backpack', { exact: true }) });
    await expect(backpack.locator('[data-test="inventory-item-name"]')).toHaveText('Sauce Labs Backpack');
    await backpack.getByRole('button', { name: 'Add to cart', exact: true }).click();
    await expect(badge(page)).toHaveText('1');
    // 2. Select Price (low to high) from the inventory sorting dropdown.
    await sort(page).selectOption({ label: 'Price (low to high)' });
    // 3. Verify that the dropdown displays Price (low to high) and that all six inventory products remain visible.
    await expectSelection(page, 'Price (low to high)', 'lohi');
    await expectInventory(page);
    // 4. Extract the displayed prices, parse them into numerical values, and compare them with an independently numerically ascending sorted copy; verify that the minimum price appears first without hardcoding the expected price sequence.
    await expectPriceOrder(page, await numericPrices(page), true);
    // 5. Verify that the shopping cart badge still displays 1.
    await expect(badge(page)).toHaveText('1');
    // 6. Open the shopping cart using the application's supported navigation and verify that it contains only Sauce Labs Backpack, with no additional products; do not complete checkout.
    await byTest(page, 'shopping-cart-link').click();
    await expect(page).toHaveURL(new URL('/cart.html', specification.applicationUrl).href);
    await expect(byTest(page, 'title')).toHaveText('Your Cart');
    await expect(items(page)).toHaveCount(1);
    await expect(items(page)).toBeVisible();
    await expect(names(page)).toHaveText(['Sauce Labs Backpack']);
    await expect(names(page)).toBeVisible();
    await expect(byTest(page, 'item-quantity')).toHaveText('1');
    await expect(badge(page)).toHaveText('1');
  });
});
