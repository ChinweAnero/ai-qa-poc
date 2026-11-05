# SCRUM-2: Test Shopping Cart Functionality

## Current planning status

**Specification ready; browser verification blocked. This is not a browser-verified plan.**

The official Playwright Planner reviewed the current inputs on 2026-11-04. This plan supersedes the prior seven-scenario plan and its obsolete acceptance-criteria clarification requests. The current specification contains six required scenarios, no proposed scenarios, no ambiguities, and status `ready`. AC5 explicitly requires the badge to disappear after removal of the last product.

- Application: https://www.saucedemo.com/
- Jira: https://chinwenduanero.atlassian.net/browse/SCRUM-2
- Specification: `tests/specifications/SCRUM-2.json`
- Requirements plan: `tests/plans/SCRUM-2.md`
- Seed: `tests/e2e/seed.spec.ts` (`seed: SauceDemo login page is accessible`)
- Intended implementation: `tests/e2e/SCRUM-2.spec.ts`
- Configuration: `playwright.config.ts`, Chromium project, SauceDemo base URL.

## Validation and exploration evidence

The parent ran the project's TypeScript specification validator successfully with:

```sh
node --import tsx orchestrator/validate-spec.ts tests/specifications/SCRUM-2.json
```

Actual output: structure `VALID`, issue `SCRUM-2`, five acceptance criteria, six scenarios, ACs mapped `5/5`, status `ready`. The npm wrapper failed before validation because the sandbox denied the `tsx` IPC listener (`EPERM`); the direct invocation uses the same validator.

The parent retrieved current Jira SCRUM-2 through Atlassian MCP. The issue was updated `2026-11-04T20:35:49.621+0000`; all five acceptance criteria match the JSON, including last-product badge disappearance. There are no remaining requirement blockers.

The official Planner's required `planner_setup_page` and `planner_save_plan` tools are absent from the available tool inventory. As a fallback, the Planner called the available Playwright MCP `browser_navigate` with `https://www.saucedemo.com/`. It returned `isError: true` with this exact message:

> MCP tool call requires approval, but approval policy is never

No page snapshot, login flow, authenticated state, product identity, cart link, removal control, badge state, selector, or route was observed in this run. No screenshots or credentials were captured. This document was saved through filesystem tooling because `planner_save_plan` is unavailable. Tool access blocks the requested browser-verified handoff; it does not invalidate or change the requirements.

## Independent starting state

Every scenario starts from a new Playwright browser context and page, with no reused authenticated state, cookies, local storage, session storage, or cart contents. Use the configured base URL and Chromium project. Each scenario performs its own login and product setup through verified supported UI actions, once browser access is available. Do not use state left by another test.

The existing seed references `[data-test="username"]`, `[data-test="password"]`, and `[data-test="login-button"]`. These are source references, not selectors freshly verified by this Planner. The default Playwright test-id attribute has not been changed; do not assume `getByTestId` targets `data-test` without configuring it within the generated test or using the established explicit attribute convention.

Product A and product B remain symbolic until observed in the real application. Select two distinct available products and record their displayed identities. Do not infer product names, labels, routes, test IDs, stock, totals, persistence, ordering, duplicate-add behavior, or empty-cart copy from memory.

## Browser verification required before final generator handoff

1. Run the supplied seed/setup with the configured application and inspect the login page using Playwright browser tools.
2. Verify an authorized demo customer setup and its UI controls without writing credentials to the plan, source, logs, or other evidence.
3. Verify the catalogue is accessible and identify distinct available products A and B by their real displayed names. Inspect their add controls and containing product elements.
4. Inspect the supported cart navigation, its actual destination, the cart item/name elements, the badge element, and item-scoped removal controls. Prefer role, label, and observed test-id locators.
5. From an empty cart, add A and observe badge `1`; open the cart and verify A. Reestablish an empty independent starting state as needed.
6. Add A and B once each and observe badge `2`; open the cart and verify both identities.
7. Remove A from that cart and verify A is absent, B remains visible, and badge `1`.
8. Remove the remaining product and verify no cart products, the removed product absent, and the badge disappears. Absence is required; a visible badge showing `0` must fail.
9. Replace this blocked-status section with actual dated observations and verified locator mappings only after successful browser exploration. Preserve the requirements and scenario IDs below.

## Acceptance criteria
- **AC1:** The user can add a product to the cart.
- **AC2:** The cart badge updates to show the number of items.
- **AC3:** The user can view added products on the cart page.
- **AC4:** The user can remove a product from the cart.
- **AC5:** When a user removes a product from the shopping cart: if other products remain, the cart badge displays the number of remaining products; if the last product is removed, the cart badge disappears; the removed product must no longer appear in the cart.

## Required scenarios

All scenarios are required acceptance-criteria cases with medium priority. The specification supports positive and boundary coverage. It defines no negative scenarios, so this plan adds no invented error-handling requirements.

### SCRUM-2-S01: Add the first product to an empty cart

- Type: boundary
- Source: acceptance_criteria
- ACs: AC1, AC2, AC3
- Priority: medium

**Source preconditions**

- A customer session able to access shopping functionality is available; the setup method must be verified before execution.
- The cart is empty and an available product A has been identified. Product names and UI controls have not been verified in this analysis.

**Steps**

1. Add product A to the cart using the application's supported action.
2. Inspect the cart badge.
3. Open the cart page and inspect its products.

**Exact source expected result:** Product A is added and is visible on the cart page. The cart badge shows an item count of 1.

**Success criteria and required assertions**

- After adding A, the badge displays exactly `1` using an auto-waiting text assertion.
- On the cart page, the item identified as product A is visible.

**Failure condition:** Any required assertion above fails, or the verified setup cannot establish the specified preconditions. Record setup/tool failures separately from confirmed application defects; never convert either into a pass or skip.

### SCRUM-2-S02: Adding a second distinct product increases the badge count

- Type: positive
- Source: acceptance_criteria
- ACs: AC1, AC2
- Priority: medium

**Source preconditions**

- A customer session able to access shopping functionality is available.
- The cart contains only product A, added once, and the badge shows 1.
- A distinct available product B has been identified.

**Steps**

1. Add product B to the cart using the application's supported action.
2. Inspect the cart badge.
3. Open the cart page and confirm product B is present.

**Exact source expected result:** Product B is added to the cart and the badge shows an item count of 2.

**Success criteria and required assertions**

- Setup establishes only A in the cart and badge `1` before adding B.
- After adding B, the badge displays exactly `2`.
- On the cart page, the item identified as product B is visible.

**Failure condition:** Any required assertion above fails, or the verified setup cannot establish the specified preconditions. Record setup/tool failures separately from confirmed application defects; never convert either into a pass or skip.

### SCRUM-2-S03: View multiple added products on the cart page

- Type: positive
- Source: acceptance_criteria
- ACs: AC3
- Priority: medium

**Source preconditions**

- A customer session able to access shopping functionality is available.
- Two distinct products A and B have each been added once to an initially empty cart. Their identities were recorded when selected.

**Steps**

1. Open the cart page using the application's supported navigation.
2. Compare the displayed products with the identities of products A and B.

**Exact source expected result:** Both added products A and B are visible on the cart page.

**Success criteria and required assertions**

- Setup adds A and B once each to an initially empty cart and records both displayed identities.
- On the cart page, A and B are both visible; compare identities, not merely an aggregate count.

**Failure condition:** Any required assertion above fails, or the verified setup cannot establish the specified preconditions. Record setup/tool failures separately from confirmed application defects; never convert either into a pass or skip.

### SCRUM-2-S04: Remove one product while another remains in the cart

- Type: positive
- Source: acceptance_criteria
- ACs: AC3, AC4, AC5
- Priority: medium

**Source preconditions**

- A customer session able to access shopping functionality is available.
- The cart contains only distinct products A and B, each added once.

**Steps**

1. Remove product A using the application's supported removal action.
2. View the cart page and inspect the products present.

**Exact source expected result:** Product A is no longer in the cart. Product B remains visible on the cart page.

**Success criteria and required assertions**

- Setup establishes only A and B, each added once.
- Remove A through its own cart-item removal control.
- On the cart page, the item identified as A is absent and B remains visible.
- AC5 also requires the badge to show the remaining product count `1`.

**Failure condition:** Any required assertion above fails, or the verified setup cannot establish the specified preconditions. Record setup/tool failures separately from confirmed application defects; never convert either into a pass or skip.

### SCRUM-2-S05: Removing one of two products decreases the badge count

- Type: positive
- Source: acceptance_criteria
- ACs: AC4, AC5
- Priority: medium

**Source preconditions**

- A customer session able to access shopping functionality is available.
- The cart contains only distinct products A and B, each added once, and the badge shows 2.

**Steps**

1. Remove product A using the application's supported removal action.
2. Inspect the cart badge.
3. View the cart page and confirm product A is no longer present.

**Exact source expected result:** Product A no longer appears in the cart and the cart badge displays the remaining product count of 1.

**Success criteria and required assertions**

- Setup establishes only A and B and explicitly verifies badge `2`.
- Remove A through its own cart-item removal control.
- The badge displays exactly `1`; A is absent on the cart page.

**Failure condition:** Any required assertion above fails, or the verified setup cannot establish the specified preconditions. Record setup/tool failures separately from confirmed application defects; never convert either into a pass or skip.

### SCRUM-2-S06: Remove the last product and verify the cart badge disappears

- Type: boundary
- Source: acceptance_criteria
- ACs: AC4, AC5
- Priority: medium

**Source preconditions**

- A customer session able to access shopping functionality is available.
- The cart contains only product A, added once, and the badge shows 1.

**Steps**

1. Remove product A using the application's supported removal action.
2. View the cart page to confirm product A is no longer present.
3. Verify that the cart badge has disappeared after removal.

**Exact source expected result:** Product A no longer appears in the cart, the cart has no products, and the cart badge disappears.

**Success criteria and required assertions**

- Setup establishes only A, added once, and explicitly verifies badge `1`.
- Remove A through its own cart-item removal control.
- A is absent on the cart page and the collection of cart product items has count `0`.
- The badge disappears. Assert the observed disappearance mechanism (DOM absence or nonvisibility) after browser verification; a visible `0` is not acceptable.

**Failure condition:** Any required assertion above fails, or the verified setup cannot establish the specified preconditions. Record setup/tool failures separately from confirmed application defects; never convert either into a pass or skip.

## Generator handoff and execution

The official Generator must read this plan and the current specification, retain all six scenario IDs in test names, retain acceptance-criteria mapping and exact source expected results in metadata/comments, and implement every required assertion. Keep all generated code in `tests/e2e/SCRUM-2.spec.ts`; reuse the seed conventions and any suitable shared fixtures without modifying unrelated tests. Use independent Playwright fixtures, scoped locators discovered from the real application, and auto-waiting assertions. Do not add fixed sleeps or silently omit blocked assertions.

A complete browser-verified generator handoff is currently unavailable because browser navigation was rejected by policy. No locator or behavior discovery is claimed. Once tools allow exploration, finish the verification checklist and update this plan before treating the implementation as verified.

After implementation, run the generated suite with the existing Chromium configuration. Record command, scenario counts, per-test results, and evidence paths. Failed assertions must retain their screenshots/traces or equivalent appropriate evidence, without exposing credentials. A genuine application mismatch must remain a failure. Invoke the official Healer only after test failures and only for a verified locator or setup problem, for at most two repair attempts. Do not weaken assertions, change acceptance criteria, skip tests, modify Jira, create commits, or create pull requests.

No generated tests were run by this planning agent, no Healer repairs were attempted, and no application verdict is available from this blocked exploration.

## Official Generator readiness assessment — 2026-11-04

The official Playwright Generator reviewed `AGENTS.md`, `agents/test-generator.md`, the current six-scenario specification, both plans, and the seed. The requirements are ready and all six scenario IDs and assertions remain required. Generation is blocked by tooling: `generator_setup_page`, `generator_read_log`, and `generator_write_test` are absent from the available tool inventory, and the Planner's available Playwright browser navigation was denied with `MCP tool call requires approval, but approval policy is never`.

The required real-time execution of scenario steps and verifications cannot be completed in this session. The Generator did not bypass the denial, invent product identities or locators, or write speculative tests or placeholders. `tests/e2e/SCRUM-2.spec.ts` was not created. No SCRUM-2 tests were executed, no tests were skipped, no assertions were weakened, and no Healer repair was appropriate. Resume after the required Playwright tools are exposed and browser navigation is allowed, then complete browser verification, generation, and execution in that order.
