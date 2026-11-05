# SCRUM-2: Test Shopping Cart Functionality

## Browser-verified planning status

The official Playwright Planner explored SauceDemo with Playwright MCP browser tools on 2026-11-05. All six source scenarios have verified UI actions, product identities, navigation and expected cart/badge observations. This plan supersedes the previous blocked planning and generator readiness records. The source specification and requirements plan are unchanged.

- Application: https://www.saucedemo.com/
- Specification: `tests/specifications/SCRUM-2.json`
- Requirements plan: `tests/plans/SCRUM-2.md`
- Seed: `tests/e2e/seed.spec.ts` (`seed: SauceDemo login page is accessible`)
- Implementation: `tests/e2e/SCRUM-2.spec.ts`
- Configuration: existing Chromium project and SauceDemo base URL.

The parent ran `node --import tsx orchestrator/validate-spec.ts tests/specifications/SCRUM-2.json`: structure VALID, five acceptance criteria, six scenarios, 5/5 criteria mapped, status ready. No requirement blockers remain. No additional Jira lookup was performed by this Planner.

The specialized `planner_setup_page` and `planner_save_plan` tools are absent from this session. The official Planner used the available Playwright MCP `browser_navigate`, `browser_snapshot`, `browser_evaluate`, `browser_click`, and `browser_run_code_unsafe` tools and saved this document through filesystem tooling. Browser navigation and interaction succeeded; the previous access-policy failure no longer blocks verification. The seed conventions were reviewed, with equivalent navigation and control checks performed in browser; the Planner did not run the seed as a test.

## Verified setup and locator mapping

Every generated scenario starts in a fresh Playwright test context, performs its own login, and establishes its own empty cart before adding products. No test depends on another scenario or reuses storage state. The exploratory session exercised the flows sequentially and returned the cart to empty; generated execution must establish fresh state independently.

The login page exposes Username and Password textboxes and a Login button. Its public demo guidance provides accepted demo users and their shared demo password. The Planner read those values inside browser code, selected the first accepted demo customer, and filled the controls without returning the values. Login succeeded and displayed Products at `/inventory.html`. Generated setup may read the same displayed guidance or use configured demo environment variables without embedding or logging credential values. Avoid persisting login-page DOM, filled form values, or credentials in evidence; preserve sanitized failure evidence if setup fails.

Product A is **Sauce Labs Backpack**. Product B is **Sauce Labs Bike Light**. Both were observed in inventory, added once, and verified by displayed name in the cart. These identities are verified test data, not additional acceptance criteria.

The existing configuration uses Playwright's default test-id attribute, so `getByTestId` does not target `data-test` unless configured. Preserve shared configuration and the seed; use explicit observed `[data-test="..."]` locators as in the seed, or configure the attribute within the generated file. Prefer role locators for controls and scope identical Add to cart/Remove button names to the matching product container.

| Purpose | Browser-verified locator/behavior |
| --- | --- |
| Username | `getByRole('textbox', { name: 'Username', exact: true })`; `data-test="username"` |
| Password | `getByRole('textbox', { name: 'Password', exact: true })`; `data-test="password"` |
| Login | `getByRole('button', { name: 'Login', exact: true })`; `data-test="login-button"` |
| Demo guidance containers | `#login_credentials`, `.login_password`; heading text followed by newline-separated demo values |
| Inventory/cart product container | `[data-test="inventory-item"]`, filtered by exact product-name descendant |
| Product name in inventory and cart | `[data-test="inventory-item-name"]` with exact A or B text |
| Add A | `[data-test="add-to-cart-sauce-labs-backpack"]`, or A container's `getByRole('button', { name: 'Add to cart', exact: true })` |
| Add B | `[data-test="add-to-cart-sauce-labs-bike-light"]`, or B container's Add to cart button |
| Cart navigation | `[data-test="shopping-cart-link"]`; exposed as role **button**, with changing name `Cart, empty`, `Cart, 1 items`, or `Cart, 2 items`; opens `/cart.html` |
| Cart title | `[data-test="title"]`, displayed text `Your Cart` |
| Badge | `[data-test="shopping-cart-badge"]`, SPAN with exact text `1` or `2`; node removed from DOM when empty |
| Remove A | A cart container's `getByRole('button', { name: 'Remove', exact: true })`; `data-test="remove-sauce-labs-backpack"` |
| Remove B | B cart container's Remove button; `data-test="remove-sauce-labs-bike-light"` |
| Continue Shopping | `getByRole('button', { name: 'Continue Shopping', exact: true })`; `data-test="continue-shopping"`; returns `/inventory.html` |

## Exploration evidence

Observed through real browser interaction, not inferred from requirements or memory:

1. Login from the public demo guidance succeeded; Products inventory displayed both selected product identities and their Add to cart controls. Empty cart had no badge.
2. Adding A produced badge `1`. Cart navigation opened `/cart.html`, where A was visible and had its own Remove control.
3. Continue Shopping returned to inventory. Adding distinct B produced badge `2`. Cart displayed both A and B.
4. Removing A from the two-product cart left only B visible, one product container, and badge `1`.
5. Removing the remaining B left zero product containers, zero product-name nodes, and zero badge nodes. Cart control read `Cart, empty`.
6. To verify the precise S06 data separately, the Planner returned to inventory, added only A, observed badge `1`, opened cart and removed A. The resulting cart had zero product containers, zero A name nodes, and zero badge nodes.

Relevant Playwright snapshots: `.playwright-mcp/page-2026-11-05T20-08-23-759Z.yml` (A in cart), `.playwright-mcp/page-2026-11-05T20-08-43-566Z.yml` (A and B), `.playwright-mcp/page-2026-11-05T20-08-54-283Z.yml` (B remains), `.playwright-mcp/page-2026-11-05T20-09-19-815Z.yml` (last A removed). DOM evaluations confirmed exact badge text and absence counts. These are exploration evidence, not generated-suite execution results. No screenshot was needed.

## Acceptance criteria

- **AC1:** The user can add a product to the cart.
- **AC2:** The cart badge updates to show the number of items.
- **AC3:** The user can view added products on the cart page.
- **AC4:** The user can remove a product from the cart.
- **AC5:** When a user removes a product from the shopping cart: if other products remain, the cart badge displays the number of remaining products; if the last product is removed, the cart badge disappears; the removed product must no longer appear in the cart.

## Required independent scenarios

All six scenarios are acceptance-criteria cases with medium priority. The source supports positive and boundary cases; it supplies no negative-case acceptance criteria, so no negative expectations are invented. Start every scenario with the fresh-context login above, assert the inventory is visible, assert badge count zero, open the cart and assert product-container count zero, then Continue Shopping to inventory. These are setup checks, not new business requirements.

### SCRUM-2-S01: Add the first product to an empty cart

- Type: boundary
- Source: acceptance_criteria
- ACs: AC1, AC2, AC3
- Priority: medium

**Source preconditions**

- A customer session able to access shopping functionality is available; the setup method must be verified before execution.
- The cart is empty and an available product A has been identified. Product names and UI controls have not been verified in this analysis.

**Verified independent setup**

Use the common fresh empty-cart setup. Confirm A is available in inventory.

**Source steps**

1. Add product A to the cart using the application's supported action.
2. Inspect the cart badge.
3. Open the cart page and inspect its products.

**Browser-verified implementation steps**

1. Click A's Add to cart control in inventory.
2. Assert the badge has exact text `1`.
3. Click the observed cart control; assert A's exact product name is visible within a cart product container.

**Exact source expected result:** Product A is added and is visible on the cart page. The cart badge shows an item count of 1.

**Success criteria and assertions:** Badge exactly `1`; A visible on cart page. Use Playwright auto-waiting assertions.

**Failure condition:** Any required assertion fails or the scenario's preconditions cannot be established. Record setup/tool failures separately from confirmed application defects; never convert failures into passes or skips.

### SCRUM-2-S02: Adding a second distinct product increases the badge count

- Type: positive
- Source: acceptance_criteria
- ACs: AC1, AC2
- Priority: medium

**Source preconditions**

- A customer session able to access shopping functionality is available.
- The cart contains only product A, added once, and the badge shows 1.
- A distinct available product B has been identified.

**Verified independent setup**

Use the common fresh empty-cart setup. Add A once and assert badge text `1`. A is the only cart product by construction; optionally open the cart to verify its sole identity, then Continue Shopping. Confirm B is distinct and available.

**Source steps**

1. Add product B to the cart using the application's supported action.
2. Inspect the cart badge.
3. Open the cart page and confirm product B is present.

**Browser-verified implementation steps**

1. Click B's Add to cart control while A is already added.
2. Assert the badge has exact text `2`.
3. Open cart using its observed control and assert B's exact product name is visible.

**Exact source expected result:** Product B is added to the cart and the badge shows an item count of 2.

**Success criteria and assertions:** Precondition badge `1`; after B badge exactly `2`; B visible on cart page. Use Playwright auto-waiting assertions.

**Failure condition:** Any required assertion fails or the scenario's preconditions cannot be established. Record setup/tool failures separately from confirmed application defects; never convert failures into passes or skips.

### SCRUM-2-S03: View multiple added products on the cart page

- Type: positive
- Source: acceptance_criteria
- ACs: AC3
- Priority: medium

**Source preconditions**

- A customer session able to access shopping functionality is available.
- Two distinct products A and B have each been added once to an initially empty cart. Their identities were recorded when selected.

**Verified independent setup**

Use the common fresh empty-cart setup. Record the observed names A and B and add each once through its own inventory control.

**Source steps**

1. Open the cart page using the application's supported navigation.
2. Compare the displayed products with the identities of products A and B.

**Browser-verified implementation steps**

1. Open cart using its observed control.
2. Assert the exact recorded name of A is visible in its cart product container. Assert the exact recorded name of B is visible in its cart product container.

**Exact source expected result:** Both added products A and B are visible on the cart page.

**Success criteria and assertions:** Both exact identities A and B visible on cart page; aggregate item count alone is insufficient. Use Playwright auto-waiting assertions.

**Failure condition:** Any required assertion fails or the scenario's preconditions cannot be established. Record setup/tool failures separately from confirmed application defects; never convert failures into passes or skips.

### SCRUM-2-S04: Remove one product while another remains in the cart

- Type: positive
- Source: acceptance_criteria
- ACs: AC3, AC4, AC5
- Priority: medium

**Source preconditions**

- A customer session able to access shopping functionality is available.
- The cart contains only distinct products A and B, each added once.

**Verified independent setup**

Use the common fresh empty-cart setup. Add A and B once each, open cart, verify both identities and exactly two product containers.

**Source steps**

1. Remove product A using the application's supported removal action.
2. View the cart page and inspect the products present.

**Browser-verified implementation steps**

1. Click Remove scoped to A's cart product container.
2. Remain on the cart page and assert A's product container/name has count `0`, while B's exact name remains visible.
3. Assert badge text `1`, preserving the linked AC5 remaining-product count rule.

**Exact source expected result:** Product A is no longer in the cart. Product B remains visible on the cart page.

**Success criteria and assertions:** A absent; B visible; remaining badge exactly `1` under linked AC5. Use Playwright auto-waiting assertions.

**Failure condition:** Any required assertion fails or the scenario's preconditions cannot be established. Record setup/tool failures separately from confirmed application defects; never convert failures into passes or skips.

### SCRUM-2-S05: Removing one of two products decreases the badge count

- Type: positive
- Source: acceptance_criteria
- ACs: AC4, AC5
- Priority: medium

**Source preconditions**

- A customer session able to access shopping functionality is available.
- The cart contains only distinct products A and B, each added once, and the badge shows 2.

**Verified independent setup**

Use the common fresh empty-cart setup. Add A and B once each, explicitly assert badge `2`, and open cart with both identities and exactly two product containers.

**Source steps**

1. Remove product A using the application's supported removal action.
2. Inspect the cart badge.
3. View the cart page and confirm product A is no longer present.

**Browser-verified implementation steps**

1. Click Remove scoped to A's cart product container.
2. Assert the badge has exact text `1`.
3. On the cart page assert A's product container/name has count `0`. Keep B visible as supporting setup/result evidence.

**Exact source expected result:** Product A no longer appears in the cart and the cart badge displays the remaining product count of 1.

**Success criteria and assertions:** Precondition badge `2`; after A removal badge exactly `1`; A absent. Use Playwright auto-waiting assertions.

**Failure condition:** Any required assertion fails or the scenario's preconditions cannot be established. Record setup/tool failures separately from confirmed application defects; never convert failures into passes or skips.

### SCRUM-2-S06: Remove the last product and verify the cart badge disappears

- Type: boundary
- Source: acceptance_criteria
- ACs: AC4, AC5
- Priority: medium

**Source preconditions**

- A customer session able to access shopping functionality is available.
- The cart contains only product A, added once, and the badge shows 1.

**Verified independent setup**

Use the common fresh empty-cart setup. Add only A once, explicitly assert badge `1`, and open cart with only A and exactly one product container.

**Source steps**

1. Remove product A using the application's supported removal action.
2. View the cart page to confirm product A is no longer present.
3. Verify that the cart badge has disappeared after removal.

**Browser-verified implementation steps**

1. Click Remove scoped to A's sole cart product container.
2. On the cart page assert A's product container/name has count `0` and the entire product-container collection has count `0`.
3. Assert the badge locator has count `0`, matching observed DOM removal; a visible badge displaying `0` fails.

**Exact source expected result:** Product A no longer appears in the cart, the cart has no products, and the cart badge disappears.

**Success criteria and assertions:** Precondition badge `1`; A absent; no cart products; badge DOM node count `0`. Use Playwright auto-waiting assertions.

**Failure condition:** Any required assertion fails or the scenario's preconditions cannot be established. Record setup/tool failures separately from confirmed application defects; never convert failures into passes or skips.

## Generator handoff and execution

Use the official Playwright Generator to implement all six scenarios in `tests/e2e/SCRUM-2.spec.ts`. Use `@playwright/test`, independent fixtures, verified locators, and no hard-coded sleeps. Reuse seed/configuration conventions without modifying unrelated tests. Include Jira and scenario IDs in test names, AC mappings in annotations/comments, and exact source expected results in comments or metadata. Keep every assertion above, including S04's remaining badge count and S06's badge DOM absence.

Execute every scenario step and verification with Playwright browser tools before generation. Specialized generator setup/log/write tools may be absent; report that accurately and use the available browser tools and filesystem save while retaining the official Generator agent workflow. Do not claim a specialized tool was invoked if it was unavailable.

Run the generated Chromium suite and record command, per-scenario outcomes, count of tests, and evidence paths. Preserve appropriate failure evidence without exposing credentials. A genuine application mismatch remains a failure. Invoke the official Healer only for failing tests and at most two repair attempts; repair verified locator/setup problems only. Do not weaken assertions, skip tests, change requirements or Jira, modify unrelated tests, create commits, or create pull requests.

No generated tests were run by this planning agent and no Healer repairs were attempted. Browser observations above support the plan; the Generator and execution run must provide the automated test verdict.

## Generator verification and execution results — 2026-11-05

The official Playwright Generator manually executed and verified all six scenarios using Playwright browser tools, then saved `tests/e2e/SCRUM-2.spec.ts`. Specialized generator setup/log/write tools were unavailable; the Generator used available browser tools and filesystem writing. The combined file preserves every scenario ID, AC mapping and exact source expected result in test annotations. Cart helpers wait for the verified page title before inspecting contents because navigation can update the URL before cart rendering completes.

Validation completed:

```sh
node --import tsx orchestrator/validate-spec.ts tests/specifications/SCRUM-2.json
npm run typecheck
node node_modules/@playwright/test/cli.js test tests/e2e/SCRUM-2.spec.ts --project=chromium
```

The specification validator reported VALID/ready with 5/5 ACs mapped; TypeScript checking passed. The generated Chromium suite passed **6/6 tests in 5.6 seconds**, with no skipped tests, retries, unresolved failures or Healer repairs.

| Scenario | Result |
| --- | --- |
| SCRUM-2-S01 | Passed — A visible in cart; badge 1 |
| SCRUM-2-S02 | Passed — second distinct product B visible; badge 2 |
| SCRUM-2-S03 | Passed — exact identities A and B visible in cart |
| SCRUM-2-S04 | Passed — A absent; B visible; badge 1 |
| SCRUM-2-S05 | Passed — badge 2 to 1; A absent; B visible |
| SCRUM-2-S06 | Passed — A absent; cart item count 0; badge DOM count 0 |

Execution evidence: `playwright-report/index.html` contains per-test results, source/AC annotations and sanitized final-state JSON attachments. `test-results/.last-run.json` records status `passed` and no failed tests. Raw trace/video captures are disabled within this generated file to avoid recording login values; failures on confirmed inventory/cart pages attach a screenshot as well as sanitized state.

The seed preflight also passed 1/1. Its initial sandboxed launch failed before application access because macOS denied Chromium's Mach port registration; the approved outside-sandbox seed and generated-suite runs succeeded. This infrastructure failure was not an application defect. No requirements, source specification, requirements plan, shared configuration or unrelated tests were changed. No commits or pull requests were created.
