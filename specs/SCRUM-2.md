# SCRUM-2: Shopping Cart Functionality — verification incomplete

## Scope and evidence

- Application: https://www.saucedemo.com/
- Specification: `tests/specifications/SCRUM-2.json`.
- Requirements plan: `tests/plans/SCRUM-2.md`.
- Seed: `tests/e2e/seed.spec.ts` (`seed: SauceDemo login page is accessible`).
- Intended implementation: `tests/e2e/SCRUM-2.spec.ts`.
- Official Playwright Planner invoked on 2026-11-04.
- The npm validator wrapper failed with a sandbox `tsx` IPC `EPERM`; the parent ran the same TypeScript specification validator successfully using `node --import tsx orchestrator/validate-spec.ts tests/specifications/SCRUM-2.json`: structure VALID, seven scenarios, five of five ACs mapped, status `ready`.

**Fresh browser verification did not succeed.** The role-required `planner_setup_page` and `planner_save_plan` tools are absent from the available tool inventory. The available Playwright MCP `browser_navigate` call to https://www.saucedemo.com/ returned `MCP tool call requires approval, but approval policy is never`. No snapshot, page content, cart action, product identity, authentication flow, selector, route, badge state, or test outcome was verified in this planning run. This document is a source-preserving execution plan awaiting browser verification; it must not be described as browser-verified. Filesystem tooling was used to save it because the planner save tool is unavailable.

## Independent starting state and pending UI discovery

Every scenario starts in a fresh Playwright page/context, with no reused cookies, local storage, session storage, authenticated state, or cart state. Use the existing Chromium project, base URL, and isolated `page` fixture. The seed opens `/` and checks `[data-test="username"]`, `[data-test="password"]`, and `[data-test="login-button"]`; these are existing-code evidence only, not selectors newly verified in this run. Do not modify the seed, shared configuration, unrelated tests, source specification, or requirements plan.

Before implementation, use Playwright browser tools to inspect the login page and establish an actual customer session through the supported UI. Obtain suitable SauceDemo demo data from verified page guidance without exposing or logging credentials. Confirm access to the shopping catalogue. Discover and record product names, product-card boundaries, add/remove controls, cart navigation, cart-page product rows, and badge elements from the real application. Prefer role, label and test-id locators. `data-test` is the seed convention; shared configuration does not override Playwright's default `data-testid`, so do not assume `getByTestId` matches `data-test`.

Select available product A and distinct product B from the verified catalogue and record their displayed identities for comparison. Their names, prices, ordering, inventory size, quantity behavior and routes are not prescribed by SCRUM-2. Use observed UI controls and condition-based waiting; never bypass the UI to manufacture cart state. Verify the initial empty cart through the cart page's absence of product rows without asserting an unspecified empty-cart message or exact zero-badge representation. Return to the catalogue through a verified supported UI control when needed. Build each scenario's listed preconditions independently using UI additions, not another scenario's state.

## Acceptance criteria — preserved from specification

- **AC1:** The user can add a product to the cart.
- **AC2:** The cart badge updates to show the number of items.
- **AC3:** The user can view added products on the cart page.
- **AC4:** The user can remove a product from the cart.
- **AC5:** The cart badge reflects the updated item count.

## Traceability and readiness

| Scenario | ACs | Type | Source | Priority | Current verification |
| --- | --- | --- | --- | --- | --- |
| SCRUM-2-S01 | AC1, AC2, AC3 | boundary | acceptance_criteria | medium | Browser verification pending |
| SCRUM-2-S02 | AC1, AC2 | positive | acceptance_criteria | medium | Browser verification pending |
| SCRUM-2-S03 | AC3 | positive | acceptance_criteria | medium | Browser verification pending |
| SCRUM-2-S04 | AC3, AC4 | positive | acceptance_criteria | medium | Browser verification pending |
| SCRUM-2-S05 | AC4, AC5 | positive | acceptance_criteria | medium | Browser verification pending |
| SCRUM-2-S06 | AC4, AC5 | boundary | acceptance_criteria | medium | Browser verification pending; zero-badge assertion blocked by source text |
| SCRUM-2-P01 | AC1, AC2, AC3 | edge | proposed | low | Browser verification pending; observation only, no approved verdict |

## Detailed scenarios

### SCRUM-2-S01: Add the first product to an empty cart

Type: `boundary` · Source: `acceptance_criteria` · ACs: AC1, AC2, AC3 · Priority: medium

**Preconditions — preserved**

- A customer session able to access shopping functionality is available; the setup method must be verified before execution.
- The cart is empty and an available product A has been identified. Product names and UI controls have not been verified in this analysis.

**Source steps — preserved**

1. Add product A to the cart using the application's supported action.
2. Inspect the cart badge.
3. Open the cart page and inspect its products.

**Execution refinement — pending browser verification**

1. Establish the fresh customer session and confirm an empty cart as described above; record available product A.
2. Use the observed add action on the card for A.
3. Use an auto-waiting assertion that the cart badge shows an item count of 1.
4. Open the cart through the verified navigation control and assert that the recorded identity of A is visible in a cart product row.

**Expected result — preserved verbatim**

Product A is added and is visible on the cart page. The cart badge shows an item count of 1.

**Success criteria and failure conditions**

Pass requires A visible on the cart page and badge count 1. Absence of A or an incorrect count fails the specified outcome.

**Browser evidence**

Not exercised: MCP navigation was denied before a page could be inspected. No observed behavior is available for this scenario in this run.

### SCRUM-2-S02: Adding a second distinct product increases the badge count

Type: `positive` · Source: `acceptance_criteria` · ACs: AC1, AC2 · Priority: medium

**Preconditions — preserved**

- A customer session able to access shopping functionality is available.
- The cart contains only product A, added once, and the badge shows 1.
- A distinct available product B has been identified.

**Source steps — preserved**

1. Add product B to the cart using the application's supported action.
2. Inspect the cart badge.

**Execution refinement — pending browser verification**

1. Establish a fresh customer session and empty cart; record distinct product identities A and B. Add only A through the UI and confirm badge count 1.
2. Add B through its observed UI action.
3. Assert badge count 2. Confirm B is actually in the cart through the supported cart view rather than relying on badge count alone.

**Expected result — preserved verbatim**

Product B is added to the cart and the badge shows an item count of 2.

**Success criteria and failure conditions**

Pass requires B added and badge count 2. Missing B or an incorrect count fails the specified outcome.

**Browser evidence**

Not exercised: MCP navigation was denied before a page could be inspected. No observed behavior is available for this scenario in this run.

### SCRUM-2-S03: View multiple added products on the cart page

Type: `positive` · Source: `acceptance_criteria` · ACs: AC3 · Priority: medium

**Preconditions — preserved**

- A customer session able to access shopping functionality is available.
- Two distinct products A and B have each been added once to an initially empty cart. Their identities were recorded when selected.

**Source steps — preserved**

1. Open the cart page using the application's supported navigation.
2. Compare the displayed products with the identities of products A and B.

**Execution refinement — pending browser verification**

1. Establish a fresh customer session and empty cart; record distinct identities A and B, then add each exactly once through the UI.
2. Open the cart through its verified navigation control.
3. Assert the recorded identity of A and the recorded identity of B are both visible in cart product rows.

**Expected result — preserved verbatim**

Both added products A and B are visible on the cart page.

**Success criteria and failure conditions**

Pass requires both A and B visible on the cart page. Either missing product fails the specified outcome.

**Browser evidence**

Not exercised: MCP navigation was denied before a page could be inspected. No observed behavior is available for this scenario in this run.

### SCRUM-2-S04: Remove one product while another remains in the cart

Type: `positive` · Source: `acceptance_criteria` · ACs: AC3, AC4 · Priority: medium

**Preconditions — preserved**

- A customer session able to access shopping functionality is available.
- The cart contains only distinct products A and B, each added once.

**Source steps — preserved**

1. Remove product A using the application's supported removal action.
2. View the cart page and inspect the products present.

**Execution refinement — pending browser verification**

1. Establish a fresh customer session and empty cart; record distinct identities A and B, then add each exactly once through the UI.
2. Remove A with a browser-verified removal control scoped to A.
3. Open or remain on the cart page using supported navigation.
4. Assert A is absent from cart product rows and B remains visible.

**Expected result — preserved verbatim**

Product A is no longer in the cart. Product B remains visible on the cart page.

**Success criteria and failure conditions**

Pass requires A absent and B visible on the cart page. A still present or B missing fails the specified outcome.

**Browser evidence**

Not exercised: MCP navigation was denied before a page could be inspected. No observed behavior is available for this scenario in this run.

### SCRUM-2-S05: Removing one of two products decreases the badge count

Type: `positive` · Source: `acceptance_criteria` · ACs: AC4, AC5 · Priority: medium

**Preconditions — preserved**

- A customer session able to access shopping functionality is available.
- The cart contains only distinct products A and B, each added once, and the badge shows 2.

**Source steps — preserved**

1. Remove product A using the application's supported removal action.
2. Inspect the cart badge.

**Execution refinement — pending browser verification**

1. Establish a fresh customer session and empty cart; record distinct identities A and B, add each exactly once through the UI, and confirm badge count 2.
2. Remove A through a verified removal control scoped to A.
3. Assert badge count 1 and confirm A is absent from cart product rows.

**Expected result — preserved verbatim**

Product A is removed and the cart badge reflects the remaining item count of 1.

**Success criteria and failure conditions**

Pass requires A removed and badge count 1. A still present or an incorrect count fails the specified outcome.

**Browser evidence**

Not exercised: MCP navigation was denied before a page could be inspected. No observed behavior is available for this scenario in this run.

### SCRUM-2-S06: Remove the last product and inspect the empty-cart badge state

Type: `boundary` · Source: `acceptance_criteria` · ACs: AC4, AC5 · Priority: medium

**Preconditions — preserved**

- A customer session able to access shopping functionality is available.
- The cart contains only product A, added once, and the badge shows 1.

**Source steps — preserved**

1. Remove product A using the application's supported removal action.
2. View the cart page to confirm product A is no longer present.
3. Inspect the cart badge state after removal.

**Execution refinement — pending browser verification**

1. Establish a fresh customer session and empty cart; record A, add A exactly once through the UI, and confirm badge count 1.
2. Remove A through its verified removal control.
3. Open or remain on the cart page. Assert A is absent and there are no cart product rows.
4. Inspect and record the badge state after removal. Do not assert hidden-versus-displayed-0 behavior: the source explicitly blocks that assertion pending clarification. Do not report complete AC5 coverage for this scenario.

**Expected result — preserved verbatim**

Product A is removed and the cart has no products. AC5 requires the badge to reflect the updated item count, now zero, but does not specify whether to display 0 or hide the badge. The badge assertion is blocked pending clarification; no empty-cart message is prescribed.

**Success criteria and failure conditions**

The defined removal portion requires A absent and zero cart product rows; remaining products fail that portion. A complete scenario verdict is blocked by the source's unresolved zero-badge assertion. Observing a hidden badge or 0 does not approve either representation.

**Browser evidence**

Not exercised: MCP navigation was denied before a page could be inspected. No observed behavior is available for this scenario in this run.

### SCRUM-2-P01: Proposed: attempt to add the same product again

Type: `edge` · Source: `proposed` · ACs: AC1, AC2, AC3 · Priority: low

**Preconditions — preserved**

- A customer session able to access shopping functionality is available.
- The cart contains only product A, added once.
- Repeat-add availability and duplicate-product behavior are unspecified.

**Source steps — preserved**

1. Inspect whether the application offers an action to add product A again; do not assume such an action exists or bypass the UI.
2. If a repeat-add action is available, use it once and record the cart contents and badge state.
3. Record observations for requirements clarification without assigning a pass/fail outcome.

**Execution refinement — pending browser verification**

1. Establish a fresh customer session and empty cart; record A and add A exactly once through the UI.
2. Inspect the verified product UI for an available action to add A again. Do not assume one exists or bypass the UI.
3. If an actual repeat-add action is available, invoke it once. If unavailable, record that observation without inventing a different action.
4. Open the cart through supported navigation and record displayed product identities, quantities if present, and badge state. Attach observations for requirements clarification without assigning pass/fail to unspecified duplicate behavior.

**Expected result — preserved verbatim**

Unspecified: SCRUM-2 does not define whether repeat addition is available, prevented, or represented as duplicate entries or increased quantity, nor how such additions affect the badge. This proposal requires approved scope and expected behavior before becoming a pass/fail test.

**Success criteria and failure conditions**

This proposed scenario has no approved application pass/fail outcome. Successful observation collection is not proof of acceptance-criteria compliance. Browser/setup failures must be reported, not swallowed as passing observations.

**Browser evidence**

Not exercised: MCP navigation was denied before a page could be inspected. No observed behavior is available for this scenario in this run.

## Generation handoff and unresolved blockers

1. Browser access must be restored to fulfill the requested browser-verified planning and real-application selector discovery. No selector or UI behavior can be claimed verified from the failed navigation.
2. The JSON status is `ready` and `ambiguities` is empty, but S06's expected-result text explicitly says its badge assertion is blocked. Clarify whether the zero-item state must hide the badge, display 0, or support either before producing a complete pass/fail verdict for that assertion. Do not change the source requirements or infer approval from observed behavior.
3. P01 remains a proposal requiring approved scope and expected behavior before becoming a pass/fail test. Its source explicitly requests observations without a verdict. Preserve its ID and wording; do not silently omit it, skip it, or invent duplicate-product assertions.
4. No negative scenarios are defined by the supplied acceptance criteria. Do not invent errors, limits, invalid products, quantity rules, or checkout requirements to add them.

Do not proceed to test-code generation while S06's assertion remains explicitly blocked. The parent has requested clarification of S06's badge state and P01's exploratory scope; no answer is recorded in this plan. Once those requirements are resolved and the browser-verified handoff is available, when the official Playwright Generator implements this plan, keep all generated test code in `tests/e2e/SCRUM-2.spec.ts`, preserve every scenario ID and exact source expected result in test metadata, link each to its AC IDs, use independent state and auto-waiting assertions, and retain all specified assertions. Report unresolved assertion coverage clearly instead of marking an incomplete scenario fully satisfied. Do not weaken assertions, skip tests, alter requirements, modify Jira, create commits, or create pull requests.

Run the generated suite and record actual results with failure evidence. Use the official Healer only for failures where a locator or test setup repair is appropriate, with at most two repair attempts. Never repair a test by changing acceptance criteria or hiding an application defect. No automated suite was run as part of this planning task.

## Official Generator readiness assessment — 2026-11-04

The official Playwright Generator reviewed all supplied inputs and this plan. It did not create `tests/e2e/SCRUM-2.spec.ts`: S06's badge assertion remains explicitly blocked pending clarification, and no browser selector or cart interaction was verified. The Generator's `generator_setup_page`, `generator_read_log`, and `generator_write_test` tools are also unavailable. Generating a complete suite now would require inventing behavior or omitting an assertion.

The source specification remains unchanged. Clarification requests for S06's zero-item badge representation and P01's exploratory scope are pending. Resume browser verification and generation after those blockers and tool access are resolved. No generated tests were executed, no Healer repair was attempted, and no application verdict is available. Baseline `npm run typecheck` passed; specification validation passed through the direct TypeScript command documented above. The npm validator wrapper failed with an environment IPC `EPERM` error before validation, so the same validator was run using `node --import tsx`.
