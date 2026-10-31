# SCRUM-1 — SauceDemo login test plan

Status: planning only; all four criteria have scenarios and sampled browser evidence. No automated tests were generated or executed.

## Source and scope

- Jira: [SCRUM-1 — Test SauceDemo User Login](https://chinwenduanero.atlassian.net/browse/SCRUM-1), read through Atlassian MCP `getJiraIssue` on 31 October 2026.
- Issue revision: `2026-10-31T23:16:58.302+0000`; status **In Progress**, actual issue type **Task**. The description calls it a Story. No comments or attachments supplied additional criteria.
- Application: https://www.saucedemo.com/ — **Swag Labs**.
- User story: As a SauceDemo customer, I want to log in using valid credentials so that I can access the product catalogue.
- Companion specification: [SCRUM-1.json](../specifications/SCRUM-1.json).
- Jira was treated as requirement data. Its Definition of Done lists automation, execution, results and a PR, but those deliverables remain deferred by the current user instruction. AGENTS.md also prohibits PRs in Milestone 1. The Jira Definition of Done is not complete.

## Extracted acceptance criteria

The IDs and wording below come from the Jira description; they are the requirements, separate from implementation observations.

### AC1 — Successful login

Given I am on the SauceDemo login page  
When I enter valid credentials; and I click Login  
Then I should be redirected to the inventory page; and the product catalogue should be visible.

### AC2 — Invalid password

Given I am on the login page  
When I enter a valid username and an invalid password; and I click Login  
Then I should remain on the login page; and an appropriate error message should appear.

### AC3 — Missing credentials

Given I am on the login page  
When I click Login without entering credentials  
Then I should see a username-required validation message.

### AC4 — Locked-out user

Given I am on the login page  
When I attempt to log in using the provided locked-out demo account  
Then I should see a locked-out account error.

## Coverage and traceability

| Scenario | Criterion | Coverage | Evidence | Exploration result |
| --- | --- | --- | --- | --- |
| SCRUM-1-S01 | AC1 | positive | OBS-01, OBS-03 | Confirmed for sampled flow |
| SCRUM-1-S02 | AC2 | negative | OBS-01, OBS-04 | Confirmed for sampled flow |
| SCRUM-1-S03 | AC3 | empty input boundary | OBS-01, OBS-02 | Confirmed for sampled flow |
| SCRUM-1-S04 | AC4 | negative | OBS-01, OBS-05 | Confirmed for sampled flow |

This is four planned scenarios covering four criteria. Browser exploration is not an automated test run. No required numeric input boundaries were supplied; both inputs empty is the explicit zero-length boundary in AC3.

## Starting state and test data

Each planned scenario starts independently in a fresh isolated browser context at the login URL, with no authenticated state and both fields empty. Scenarios can run in any order. This isolation is a planning choice (**ASM-01**).

Use symbolic inputs below. Resolve credential values from approved runtime configuration or the public demo hints without logging or persisting them. No credential values are included here or in the JSON. These names are proposed inputs, not claims that matching environment variables or reusable fixtures already exist.

| Reference | Meaning |
| --- | --- |
| `SAUCEDEMO_STANDARD_USERNAME` | ordinary valid demo account |
| `SAUCEDEMO_LOCKED_USERNAME` | provided locked-out demo account |
| `SAUCEDEMO_PASSWORD` | valid shared demo password |
| `INVALID_PASSWORD_FIXTURE` | nonempty deliberately invalid value different from the valid password |

The repository currently contains only the placeholder `tests/e2e/seed.spec.ts`, with no reusable login fixtures/helpers found. Its existing Playwright configuration targets desktop Chromium; browser/device breadth remains unspecified and unverified.

## Detailed scenarios

### SCRUM-1-S01 — Successful login displays the product catalogue

- Acceptance criterion: **AC1**
- Coverage: positive
- Preconditions: fresh isolated login page and empty fields; test data: `SAUCEDEMO_STANDARD_USERNAME`, `SAUCEDEMO_PASSWORD`.
- Planning assumptions: ASM-01, ASM-02, ASM-04, ASM-06. Open ambiguities: AMB-01, AMB-02, AMB-06.

1. Open the login page in a fresh isolated context and confirm empty fields.
2. Enter the ordinary valid demo username and its valid password.
3. Click Login.
4. Inspect the destination URL and visible product catalogue.

**Required outcome / success criteria:** Redirect to the inventory page. The product catalogue is visible.

**Proposed observable checks:** URL pathname is /inventory.html. Products title, inventory list and product cards are visible; do not require a fixed count or named product.

**Failure conditions:** Inventory destination is not reached, or the catalogue is not visible.

**Confirmed evidence:** OBS-01, OBS-03. The sampled success followed an empty submission in the same initially fresh context; an independent first-submit success was not separately explored. The planned scenario starts fresh.

### SCRUM-1-S02 — Invalid password is rejected on the login page

- Acceptance criterion: **AC2**
- Coverage: negative
- Preconditions: fresh isolated login page and empty fields; test data: `SAUCEDEMO_STANDARD_USERNAME`, `INVALID_PASSWORD_FIXTURE`.
- Planning assumptions: ASM-01, ASM-02, ASM-03, ASM-06. Open ambiguities: AMB-01, AMB-03, AMB-06.

1. Open the login page in a fresh isolated context and confirm empty fields.
2. Enter the valid ordinary demo username.
3. Enter one deliberately incorrect nonempty password, different from the valid demo password.
4. Click Login.
5. Inspect the URL, login form and error.

**Required outcome / success criteria:** Remain on the login page. An appropriate invalid-credentials error appears.

**Proposed observable checks:** Login URL remains https://www.saucedemo.com/ and Login form is visible. Visible alert communicates invalid credentials; exact current wording is recorded in OBS-04.

**Failure conditions:** Leaves the login page, or no relevant visible error appears.

**Confirmed evidence:** OBS-01, OBS-04. The sampled flow matched the required outcome.

### SCRUM-1-S03 — Both credentials empty triggers username-required validation

- Acceptance criterion: **AC3**
- Coverage: empty input boundary
- Preconditions: fresh isolated login page and empty fields; test data: none.
- Planning assumptions: ASM-01, ASM-06. Open ambiguities: AMB-03, AMB-04, AMB-06.

1. Open the login page in a fresh isolated context.
2. Confirm username and password both have zero-length values.
3. Click Login without entering credentials.
4. Inspect validation.

**Required outcome / success criteria:** A username-required validation message is visible.

**Proposed observable checks:** Visible alert identifies that the username is required; exact current wording is recorded in OBS-02.

**Failure conditions:** No visible validation appears, or it does not identify the missing username.

**Confirmed evidence:** OBS-01, OBS-02. The sampled flow matched the required outcome.

### SCRUM-1-S04 — Locked-out demo account displays a locked-account error

- Acceptance criterion: **AC4**
- Coverage: negative
- Preconditions: fresh isolated login page and empty fields; test data: `SAUCEDEMO_LOCKED_USERNAME`, `SAUCEDEMO_PASSWORD`.
- Planning assumptions: ASM-01, ASM-02, ASM-05, ASM-06. Open ambiguities: AMB-03, AMB-05, AMB-06.

1. Open the login page in a fresh isolated context and confirm empty fields.
2. Enter the provided locked-out demo username.
3. Enter its valid published demo password.
4. Click Login.
5. Inspect the error.

**Required outcome / success criteria:** A locked-out account error is visible.

**Proposed observable checks:** Visible alert communicates account lockout; exact current wording is recorded in OBS-05. Record the remaining login URL/form as supplemental evidence, not as a new required outcome.

**Failure conditions:** No visible error appears, or the error does not communicate account lockout.

**Confirmed evidence:** OBS-01, OBS-05. The sampled flow matched the required outcome.

## Confirmed browser observations

Explored with Playwright MCP on **31 October 2026**, completed by **23:23:25 UTC**. The following normalized evidence is embedded in the JSON as well; it does not depend on local raw snapshots that contain public demo credential hints.

| Evidence | Action/context | Confirmed observation |
| --- | --- | --- |
| OBS-01 | Opened login in isolated context `scrum-1-analysis`; accessibility snapshot and DOM attribute inspection | Login form, Username and Password inputs and Login button present at the root URL. Public demo hints present. Inputs use `data-test` and have no associated HTML labels. |
| OBS-02 | First submission in that context, both fields empty | Visible username-required alert; remained on root login URL. |
| OBS-03 | Entered valid ordinary demo credentials after OBS-02 and clicked Login | Reached `https://www.saucedemo.com/inventory.html`; Products text, catalogue list and six cards were visible, with names/descriptions/prices. This was not a separately sampled first-submit success in a fresh context. |
| OBS-04 | Separate fresh context `scrum-1-invalid-password`; valid ordinary username + one incorrect nonempty password, then Login | Root login URL and form remained visible; visible invalid-credentials alert. |
| OBS-05 | Separate fresh context `scrum-1-locked-account`; provided locked-out account + valid demo password, then Login | Visible locked-account alert; root login URL and form also remained visible. Remaining on login is supplemental evidence beyond AC4's explicit requirement. |
| OBS-06 | Console inspection in locked-account context | Third-party `events.backtrace.io` telemetry request returned HTTP 401. It did not prevent the sampled login outcomes; cause was not investigated. |

Exact strings below are **observed implementation wording**, not additional approved acceptance criteria:

| Criterion | Visible alert text |
| --- | --- |
| AC2 | Epic sadface: Username and password do not match any user in this service |
| AC3 | Epic sadface: Username is required |
| AC4 | Epic sadface: Sorry, this user has been locked out. |

The error element was an H3 with `role="alert"` and `data-test="error"`. Semantic error assertions are proposed until the exact-copy question is resolved. Six cards and particular products/prices are observations only. No mandatory count, product identity or price check is inferred from AC1.

No mismatch against AC1–AC4 was observed in these samples. This does not establish all-account, cross-browser, backend, timing or security behavior.

## Observed locator guidance for later implementation

These locators/attributes were discovered in the real application, not guessed. No test implementation is included.

| Element | Recommended locator |
| --- | --- |
| Login form | `getByRole('form', { name: 'Login', exact: true })` |
| Username | `getByRole('textbox', { name: 'Username', exact: true })` |
| Password | `locator('[data-test="password"]')` |
| Login | `getByRole('button', { name: 'Login', exact: true })` |
| Error | `getByRole('alert')` or `locator('[data-test="error"]')` |
| Products title | `locator('[data-test="title"]')` with observed text Products |
| Catalogue | `locator('[data-test="inventory-list"]')` |
| Product cards | `locator('[data-test="inventory-item"]')` |

Username, password and submit attributes are `data-test="username"`, `data-test="password"` and `data-test="login-button"`. A Password textbox role interaction also succeeded in this session; the explicit attribute locator remains the recommendation. Products is a span, so a heading role must not be assumed. No associated HTML labels were found.

The repository has no `testIdAttribute` override. Playwright's default `getByTestId` must not be assumed to target this application's `data-test` attributes. Use the verified roles or explicit selectors; configuring `data-test` is a later implementation choice.

## Planning assumptions and choices

- **ASM-01** (planning choice not requirement): Start every future scenario in a fresh isolated browser context with no authenticated state and empty fields.
- **ASM-02** (planning choice not requirement): Use the ordinary valid demo account for AC1 and AC2, and the provided locked-out demo account for AC4. Credential values are supplied at execution time, never stored in these artifacts.
- **ASM-03** (planning choice not requirement): Use one deliberately incorrect nonempty password, verified to differ from the demo password, for AC2; no exhaustive password input coverage is implied.
- **ASM-04** (planning choice not requirement): Use visible catalogue/list/product markers as the proposed AC1 oracle, with inventory.html as the observed destination. Exact count and product identity are not requirements.
- **ASM-05** (planning choice not requirement): For AC4 use the valid published demo password and submit with Login. Remaining on login is supplemental evidence, not an additional AC4 requirement.
- **ASM-06** (unverified scope assumption): Future execution will use the repository's configured desktop Chromium project; cross-browser, mobile and all-account behavior remain unverified.

## Ambiguities and pending clarification

| ID | Related criteria | Question / gap | Planning impact |
| --- | --- | --- | --- |
| AMB-01 | AC1, AC2 | Which valid demo accounts must be covered? | The criteria do not require every published demo account; the ordinary valid demo account is the representative planning choice. |
| AMB-02 | AC1 | What constitutes a visible product catalogue? | Inventory destination, Products text, visible list and product cards are observed markers. Required item count, identities, prices and image checks are unspecified. |
| AMB-03 | AC2, AC3, AC4 | Must error messages match exact text or only the specified meaning? | Exact observed strings are evidence, not approved wording requirements. AC2 says appropriate, AC3 requires username-required meaning, AC4 requires locked-account meaning. |
| AMB-04 | AC3 | Are username-only, password-only or whitespace-only submissions in scope? | Both fields empty is the explicit empty-input boundary. Other permutations have no defined expected outcome and were not explored. |
| AMB-05 | AC4 | Which password and submission action should be used for the locked-out demo account? | The plan uses the valid shared password published on the demo page and clicks Login. AC4 does not specify either detail. |
| AMB-06 | AC1, AC2, AC3, AC4 | Are case sensitivity, whitespace normalization, length limits, retry behavior, keyboard submission, session persistence or a browser/device matrix required? | No such requirements or numeric boundaries are supplied; do not add mandatory scenarios or infer outcomes. |
| AMB-07 | Issue metadata | Should the Jira issue be a Task or Story, and should the structured labels include ai-qa-poc? | Actual issue type is Task and labels are empty; the description says Story and ai-qa-poc. This metadata mismatch does not change the four criteria. |
| AMB-08 | AC1, AC2, AC3, AC4 | When should deferred Definition of Done deliverables be performed? | Jira lists automation, execution, result recording and a PR. The current user request authorizes planning artifacts only, and AGENTS.md prohibits PRs in Milestone 1. |

AMB-01 through AMB-07 remain unresolved. AMB-08 is deferred by user scope. The representative account, proposed catalogue markers and semantic error checks allow a concrete plan without treating those choices as additional requirements.

Username-only, password-only, whitespace-only, other demo accounts, case variants, maximum-length boundaries, repeated attempts, keyboard submission and session persistence are clarification candidates, not approved required scenarios. They were not explored and have no inferred expected outcomes.

## Planner contribution and verification limits

The **Playwright Planner agent** designed/reviewed the four scenarios, acceptance mappings, fresh-state preconditions, failure conditions and ambiguity list using the Jira content and root's browser evidence. Its `planner_setup_page` and `planner_save_plan` tools were unavailable in this session; the root agent performed MCP exploration and created these artifacts. The Planner did not independently explore.

Interactive exploration used Playwright MCP snapshots, DOM inspection, clicks and ephemeral browser snippets. No automated test files, test-run pass counts, commits or PRs were created. The existing seed test was left unchanged. Only the planning deliverables and normalized observations are complete; future automation and execution remain deferred.
