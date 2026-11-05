// spec: specs/SCRUM-2.md
// seed: tests/e2e/seed.spec.ts
// Browser actions and all six scenarios verified with Playwright MCP on 2026-11-05.
import { test, expect, type Page } from '@playwright/test';
import specification from '../specifications/SCRUM-2.json';

const A = 'Sauce Labs Backpack';
const B = 'Sauce Labs Bike Light';

// Reuse the seed's observed data-test convention without changing shared config.
const byTest = (page: Page, name: string) => page.locator(`[data-test="${name}"]`);
const items = (page: Page) => byTest(page, 'inventory-item');
const badge = (page: Page) => byTest(page, 'shopping-cart-badge');
const product = (page: Page, name: string) => items(page).filter({
  has: page.getByText(name, { exact: true }),
});

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

async function openCart(page: Page) {
  await byTest(page, 'shopping-cart-link').click();
  await expect(page).toHaveURL(new URL('/cart.html', specification.applicationUrl).href);
  // The URL can update before the cart DOM; assert its title before inspecting items.
  await expect(byTest(page, 'title')).toHaveText('Your Cart');
}

async function continueShopping(page: Page) {
  await page.getByRole('button', { name: 'Continue Shopping', exact: true }).click();
  await expect(page).toHaveURL(new URL('/inventory.html', specification.applicationUrl).href);
  await expect(byTest(page, 'title')).toHaveText('Products');
}

async function addProduct(page: Page, name: string) {
  await expect(product(page, name).locator('[data-test="inventory-item-name"]')).toHaveText(name);
  await product(page, name).getByRole('button', { name: 'Add to cart', exact: true }).click();
}

async function expectProduct(page: Page, name: string) {
  const displayedName = product(page, name).locator('[data-test="inventory-item-name"]');
  await expect(displayedName).toHaveText(name);
  await expect(displayedName).toBeVisible();
}

async function twoProductCart(page: Page) {
  await addProduct(page, A);
  await addProduct(page, B);
  await expect(badge(page)).toHaveText('2');
  await openCart(page);
  await expect(items(page)).toHaveCount(2);
  await expectProduct(page, A);
  await expectProduct(page, B);
}

// Raw traces/videos include login values and public demo guidance. Use sanitized
// state evidence for every outcome, plus a post-login screenshot on failure.
test.use({ trace: 'off', video: 'off', screenshot: 'off' });

test.describe('SCRUM-2: Test Shopping Cart Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Every page fixture has a fresh context; no shared session or cart state.
    await page.goto('/');
    const usernameInput = page.getByRole('textbox', { name: 'Username', exact: true });
    const passwordInput = page.getByRole('textbox', { name: 'Password', exact: true });
    const loginButton = page.getByRole('button', { name: 'Login', exact: true });
    await expect(usernameInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(loginButton).toBeVisible();

    // Read the verified, page-published demo guidance without embedding/logging values.
    const users = (await page.locator('#login_credentials').innerText())
      .split('\n').map(value => value.trim()).filter(Boolean);
    const demoPassword = (await page.locator('.login_password').innerText())
      .split('\n').map(value => value.trim()).filter(Boolean).at(-1);
    const demoUser = users[1];
    if (!demoUser || !demoPassword) throw new Error('Published demo account guidance is unavailable.');
    await usernameInput.fill(demoUser);
    await passwordInput.fill(demoPassword);
    await loginButton.click();
    await expect(page).toHaveURL(new URL('/inventory.html', specification.applicationUrl).href);
    await expect(byTest(page, 'title')).toHaveText('Products');

    // Establish the specified empty-cart precondition through the verified UI.
    await expect(badge(page)).toHaveCount(0);
    await openCart(page);
    await expect(items(page)).toHaveCount(0);
    await continueShopping(page);
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
          productNames: await byTest(page, 'inventory-item-name').allTextContents(),
          productCount: await items(page).count(),
          badgeTexts: await badge(page).allTextContents(),
          badgeCount: await badge(page).count(),
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

  test('SCRUM-2-S01 [AC1, AC2, AC3]: Add the first product to an empty cart', details('SCRUM-2-S01'), async ({ page }) => {
    // 1. Add product A to the cart using the application's supported action.
    await addProduct(page, A);
    // 2. Inspect the cart badge.
    await expect(badge(page)).toHaveText('1');
    // 3. Open the cart page and inspect its products.
    await openCart(page);
    await expectProduct(page, A);
    await expect(badge(page)).toHaveText('1');
  });

  test('SCRUM-2-S02 [AC1, AC2]: Adding a second distinct product increases the badge count', details('SCRUM-2-S02'), async ({ page }) => {
    // Precondition: only A has been added once and the badge shows 1.
    await addProduct(page, A);
    await expect(badge(page)).toHaveText('1');
    // 1. Add product B to the cart using the application's supported action.
    await addProduct(page, B);
    // 2. Inspect the cart badge.
    await expect(badge(page)).toHaveText('2');
    // 3. Open the cart page and confirm product B is present.
    await openCart(page);
    await expectProduct(page, B);
    await expect(badge(page)).toHaveText('2');
  });

  test('SCRUM-2-S03 [AC3]: View multiple added products on the cart page', details('SCRUM-2-S03'), async ({ page }) => {
    // Precondition: record the verified distinct identities and add each once.
    await addProduct(page, A);
    await addProduct(page, B);
    // 1. Open the cart page using the application's supported navigation.
    await openCart(page);
    // 2. Compare the displayed products with the identities of products A and B.
    await expectProduct(page, A);
    await expectProduct(page, B);
  });

  test('SCRUM-2-S04 [AC3, AC4, AC5]: Remove one product while another remains in the cart', details('SCRUM-2-S04'), async ({ page }) => {
    // Precondition: the cart contains only A and B, each added once.
    await twoProductCart(page);
    // 1. Remove product A using the application's supported removal action.
    await product(page, A).getByRole('button', { name: 'Remove', exact: true }).click();
    // 2. View the cart page and inspect the products present.
    await expect(byTest(page, 'title')).toHaveText('Your Cart');
    await expect(product(page, A)).toHaveCount(0);
    await expectProduct(page, B);
    // Linked AC5 requires the badge to display the remaining product count.
    await expect(badge(page)).toHaveText('1');
  });

  test('SCRUM-2-S05 [AC4, AC5]: Removing one of two products decreases the badge count', details('SCRUM-2-S05'), async ({ page }) => {
    // Precondition: only A and B are present and the badge shows 2.
    await twoProductCart(page);
    // 1. Remove product A using the application's supported removal action.
    await product(page, A).getByRole('button', { name: 'Remove', exact: true }).click();
    // 2. Inspect the cart badge.
    await expect(badge(page)).toHaveText('1');
    // 3. View the cart page and confirm product A is no longer present.
    await expect(byTest(page, 'title')).toHaveText('Your Cart');
    await expect(product(page, A)).toHaveCount(0);
    await expectProduct(page, B);
  });

  test('SCRUM-2-S06 [AC4, AC5]: Remove the last product and verify the cart badge disappears', details('SCRUM-2-S06'), async ({ page }) => {
    // Precondition: only A is present, added once, and the badge shows 1.
    await addProduct(page, A);
    await expect(badge(page)).toHaveText('1');
    await openCart(page);
    await expect(items(page)).toHaveCount(1);
    await expectProduct(page, A);
    // 1. Remove product A using the application's supported removal action.
    await product(page, A).getByRole('button', { name: 'Remove', exact: true }).click();
    // 2. View the cart page to confirm product A is no longer present.
    await expect(byTest(page, 'title')).toHaveText('Your Cart');
    await expect(product(page, A)).toHaveCount(0);
    await expect(items(page)).toHaveCount(0);
    // 3. Verify that the cart badge has disappeared after removal.
    await expect(badge(page)).toHaveCount(0);
  });
});
