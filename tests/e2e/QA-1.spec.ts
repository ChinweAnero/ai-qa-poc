// spec: specs/QA-1.md
// seed: tests/e2e/seed.spec.ts
// Current MCP exploration was blocked by approval policy. These selectors use
// the supplied seed and historical plan; this file needs a fresh browser run.
import { randomUUID } from 'node:crypto';
import { test, expect, type Page, type TestInfo } from '@playwright/test';
import specification from '../specifications/QA-1.json';

// The seed uses data-test; shared configuration uses Playwright's default
// data-testid, so reuse the seed's explicit convention without changing config.
const byTest = (page: Page, name: string) => page.locator(`[data-test="${name}"]`);
const username = (page: Page) => byTest(page, 'username');
const password = (page: Page) => byTest(page, 'password');
const login = (page: Page) => page.getByRole('button', { name: 'Login', exact: true });
const privateValues = new WeakMap<Page, string[]>();

function details(id: string) {
  const scenario = specification.scenarios.find(item => item.id === id);
  if (!scenario) throw new Error(`Missing specification scenario: ${id}`);
  return {
    tag: scenario.source === 'proposed' ? '@proposed' : '@acceptance',
    annotation: [
      { type: 'jira', description: specification.jiraKey },
      { type: 'scenario', description: scenario.id },
      ...scenario.acceptanceCriteria.map(ac => ({ type: 'acceptance-criterion', description: ac })),
      { type: 'source', description: scenario.source },
      { type: 'scenario-type', description: scenario.type },
      { type: 'priority', description: scenario.priority },
      ...scenario.preconditions.map(description => ({ type: 'precondition', description })),
      { type: 'expected-result', description: scenario.expectedResult },
      { type: 'verification-limit', description: 'Current Playwright MCP verification blocked by approval policy; selectors and flows require a fresh browser execution.' },
      ...(scenario.source === 'proposed' ? [{
        type: 'verdict-scope',
        description: 'Exploration completion only; unspecified application behavior has no pass/fail verdict.',
      }] : []),
    ],
  };
}

async function demoCredentials(page: Page, account: 'standard' | 'locked-out' = 'standard') {
  const accounts = (await byTest(page, 'login-credentials').innerText())
    .split('\n').map(line => line.trim());
  const user = accounts.find(value => value.startsWith(account === 'standard' ? 'standard_' : 'locked_out_'));
  const pass = (await byTest(page, 'login-password').innerText())
    .split('\n').map(line => line.trim()).filter(line => line && !line.endsWith(':')).at(-1);
  if (!user || !pass) throw new Error('Published demo account guidance is unavailable or has changed.');
  privateValues.set(page, [...(privateValues.get(page) ?? []), user, pass]);
  return { user, pass };
}

function invalidPassword(page: Page) {
  const value = `invalid-${randomUUID()}`;
  privateValues.set(page, [...(privateValues.get(page) ?? []), value]);
  return value;
}

function redact(page: Page, text: string) {
  return (privateValues.get(page) ?? []).reduce((result, value) => result.split(value).join('[redacted]'), text);
}

async function state(page: Page) {
  const error = byTest(page, 'error');
  return {
    destination: redact(page, new URL(page.url()).origin + new URL(page.url()).pathname),
    error: await error.isVisible() ? redact(page, await error.innerText()) : null,
    catalogueVisible: await byTest(page, 'inventory-list').isVisible(),
    loginVisible: await login(page).isVisible(),
  };
}

async function attachState(page: Page, info: TestInfo, stage: string, responseObserved?: boolean) {
  await info.attach(stage, {
    body: JSON.stringify({ scenario: info.annotations.find(item => item.type === 'scenario')?.description,
      responseObserved, ...await state(page) }, null, 2),
    contentType: 'application/json',
  });
}

// An exploratory outcome may be an error, navigation, or no observable response.
// A condition timeout is recorded as inconclusive, not converted to a required
// application outcome. Other browser/setup errors still fail the exercise.
async function observe(page: Page, info: TestInfo, stage: string, previousError: string | null = null) {
  let responseObserved = true;
  try {
    await page.waitForFunction(previous => {
      const visible = (element: Element | null) => !!element && element.getClientRects().length > 0;
      const error = document.querySelector('[data-test="error"]');
      return visible(document.querySelector('[data-test="inventory-list"]')) ||
        (visible(error) && !!error?.textContent?.trim() && error.textContent.trim() !== previous);
    }, previousError, { timeout: 10_000 }); // Observation deadline, never a fixed sleep.
  } catch (error) {
    if (!(error instanceof Error) || error.name !== 'TimeoutError') throw error;
    responseObserved = false;
    info.annotations.push({ type: 'observation-limit', description: `${stage}: no changed response observed before the condition timeout.` });
  }
  await attachState(page, info, stage, responseObserved);
}

// Keep shared baseURL/browser/timeouts. Raw traces, videos and failure images
// can expose the public demo password and filled credentials; use sanitized
// JSON evidence below, including on assertion failure, instead.
test.use({ trace: 'off', video: 'off', screenshot: 'off' });

test.describe('QA-1: SauceDemo Login — SCRUM-1', () => {
  test.beforeEach(async ({ page }) => {
    // Each Playwright page fixture has a fresh isolated browser context.
    await page.goto('/');
    await expect(username(page)).toBeVisible();
    await expect(password(page)).toBeVisible();
    await expect(login(page)).toBeVisible();
    await expect(username(page)).toBeEmpty();
    await expect(password(page)).toBeEmpty();
    await expect(byTest(page, 'error')).toBeHidden();
  });

  test.afterEach(async ({ page }, info) => {
    if (!page.isClosed() && /^https?:/.test(page.url())) {
      await attachState(page, info, 'sanitized-final-state');
    }
  });

  test('SCRUM-1-S01 [AC1]: Successful login displays the product catalogue', details('SCRUM-1-S01'), async ({ page }) => {
    // 1. Obtain the published standard demo account and password without persisting values.
    const { user, pass } = await demoCredentials(page);
    // 2. Fill Username and Password, then click Login.
    await username(page).fill(user);
    await password(page).fill(pass);
    await login(page).click();
    // 3. Verify inventory redirection and a visible product catalogue; no fixed product count.
    await expect(page).toHaveURL(new URL('/inventory.html', specification.applicationUrl).href);
    await expect(byTest(page, 'title')).toHaveText('Products');
    await expect(byTest(page, 'inventory-list')).toBeVisible();
    await expect(byTest(page, 'inventory-item').first()).toBeVisible();
  });

  test('SCRUM-1-S02 [AC2]: Invalid password is rejected on the login page', details('SCRUM-1-S02'), async ({ page }, info) => {
    // 1. Obtain the published standard demo username.
    const { user } = await demoCredentials(page);
    const loginUrl = page.url();
    // 2. Enter the valid username and a deliberately nonempty invalid password.
    await username(page).fill(user);
    await password(page).fill(invalidPassword(page));
    // 3. Click Login and inspect the visible error.
    await login(page).click();
    await expect(byTest(page, 'error')).toBeVisible();
    await expect(byTest(page, 'error')).toHaveText(/\S/);
    // 4. Confirm the login page remains; exact error copy is not a requirement.
    await expect(page).toHaveURL(loginUrl);
    await expect(login(page)).toBeVisible();
    info.annotations.push({ type: 'manual-review', description: 'AC2 error presence is automated; the requirement owner must judge the unspecified meaning of appropriate using sanitized evidence.' });
  });

  test('SCRUM-1-S03 [AC3]: Both credentials empty triggers username-required validation', details('SCRUM-1-S03'), async ({ page }) => {
    // 1. Confirm both credential inputs contain zero characters.
    await expect(username(page)).toBeEmpty();
    await expect(password(page)).toBeEmpty();
    // 2. Click Login without entering any credentials.
    await login(page).click();
    // 3. Verify username-required meaning without adding exact copy or navigation requirements.
    await expect(byTest(page, 'error')).toBeVisible();
    await expect(byTest(page, 'error')).toContainText(/username.*required/i);
  });

  test('SCRUM-1-S04 [AC4]: Locked-out demo account displays a locked-account error', details('SCRUM-1-S04'), async ({ page }) => {
    // 1. Obtain the page-published locked-out demo account and shared demo password.
    const { user, pass } = await demoCredentials(page, 'locked-out');
    // 2. Fill the demo credentials and click Login using the historical plan's submission method.
    await username(page).fill(user);
    await password(page).fill(pass);
    await login(page).click();
    // 3. Verify locked-out-account meaning; no exact copy or navigation requirement is added.
    await expect(byTest(page, 'error')).toBeVisible();
    await expect(byTest(page, 'error')).toContainText(/locked[\s-]*out/i);
  });

  test('SCRUM-1-P01 [AC3]: Proposed: submit a valid username with an empty password', details('SCRUM-1-P01'), async ({ page }, info) => {
    // 1. Obtain the standard demo username and enter it.
    const { user } = await demoCredentials(page);
    await username(page).fill(user);
    // 2. Leave Password at zero characters and click Login.
    await expect(password(page)).toBeEmpty();
    await login(page).click();
    // 3. Record the response and destination; no application pass/fail verdict is specified.
    await observe(page, info, 'proposed-missing-password');
  });

  test('SCRUM-1-P02 [AC3]: Proposed: submit a password with an empty username', details('SCRUM-1-P02'), async ({ page }, info) => {
    // 1. Leave Username at zero characters.
    await expect(username(page)).toBeEmpty();
    // 2. Obtain the shared demo password and enter it without persisting its value.
    const { pass } = await demoCredentials(page);
    await password(page).fill(pass);
    // 3. Click Login and record the response without adopting AC3's both-empty outcome.
    await login(page).click();
    await observe(page, info, 'proposed-missing-username');
  });

  test('SCRUM-1-P03 [AC3]: Proposed: submit whitespace-only credential fields', details('SCRUM-1-P03'), async ({ page }, info) => {
    // 1. Enter exactly one ordinary space in each input.
    await username(page).fill(' ');
    await password(page).fill(' ');
    // 2. Click Login.
    await login(page).click();
    // 3. Record response and destination without inferring trimming or normalization requirements.
    await observe(page, info, 'proposed-whitespace');
  });

  test('SCRUM-1-P04 [AC1, AC2]: Proposed: correct an invalid password and retry login', details('SCRUM-1-P04'), async ({ page }, info) => {
    // 1. Obtain the standard demo account and valid password without persisting their values.
    const { user, pass } = await demoCredentials(page);
    // 2. Enter the valid username with an invalid password and click Login.
    await username(page).fill(user);
    await password(page).fill(invalidPassword(page));
    await login(page).click();
    // 3. Record the first response, then retry only if the login form remains available.
    await observe(page, info, 'proposed-retry-invalid-attempt');
    if (!await login(page).isVisible()) {
      info.annotations.push({ type: 'observation-limit', description: 'Login form unavailable after first attempt; no invented recovery performed.' });
      return;
    }
    const previousError = await byTest(page, 'error').isVisible() ? await byTest(page, 'error').innerText() : null;
    await password(page).fill(pass);
    await login(page).click();
    // 4. Record destination, catalogue and prior-error handling without a required retry verdict.
    await observe(page, info, 'proposed-retry-corrected-attempt', previousError);
  });

  test('SCRUM-1-P05 [AC1]: Proposed: attempt login with keyboard submission', details('SCRUM-1-P05'), async ({ page }, info) => {
    // 1. Obtain the standard demo account and valid password.
    const { user, pass } = await demoCredentials(page);
    // 2. Fill Username and Password.
    await username(page).fill(user);
    await password(page).fill(pass);
    // 3. Keep focus in Password and press Enter instead of clicking Login.
    await password(page).press('Enter');
    // 4. Record submission response, destination and visible content without a required verdict.
    await observe(page, info, 'proposed-keyboard-submission');
  });
});
