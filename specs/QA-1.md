# QA-1: SauceDemo Login — Browser Test Plan (verification incomplete)

## Scope and source

- Application: https://www.saucedemo.com/
- Plan artifact: `specs/QA-1.md`; specification: `tests/specifications/QA-1.json`.
- Source Jira issue: `SCRUM-1` — Test SauceDemo User Login. `QA-1` is the requested artifact identity; the specification does not identify a separate QA-1 Jira issue.
- Requirements plan reviewed: `tests/plans/QA-1.md`.
- Seed test: `tests/e2e/seed.spec.ts` — `seed: SauceDemo login page is accessible`.
- Planning agent: official Playwright Planner, invoked on 2026-11-04. Fresh browser exploration was attempted through Playwright MCP and blocked by tool approval policy. Browser observations retained below come from the existing plan and were not independently reverified in this run.
- Current specification status on disk: `ready`, with an empty `ambiguities` array. Some scenario preconditions and expected-result text still request clarification; those residual questions are retained below. This plan does not change the JSON status or requirements.
- Requested generation target: `tests/e2e/QA-1.spec.ts`, using the official Playwright Generator after planning. No Jira changes, commits, or pull requests are authorized.

## Current verification limitation

The role-required `planner_setup_page` and `planner_save_plan` tools are absent from the available tool inventory. The available Playwright MCP `browser_navigate` and `browser_run_code_unsafe` calls both returned: `MCP tool call requires approval, but approval policy is never`. No current browser page or selector inspection succeeded. This plan was saved through filesystem tooling instead. A complete fresh browser-verified plan cannot be claimed until browser access is available.

All interface descriptions and browser observations below are retained historical evidence from the pre-existing plan. P01, P03, P04, and P05 had no historical execution evidence and remain unverified. Do not treat a test runner pass for an exploratory scenario as approval of its unspecified behavior.

## Seed and independent starting state

The seed was read as the starting test structure. It opens `/` and checks the visible `data-test` username, password, and login-button elements. The existing plan reports prior browser confirmation of these elements and accessible names; current verification is blocked. The seed was not edited or executed as an automated test in this planning task.

For every scenario, create a new isolated browser context and page with no cookies, local storage, session storage, or authenticated session. Navigate to https://www.saucedemo.com/ and confirm Username, Password, and Login are visible. Start with both fields empty and no validation message. Each scenario can run independently in any order. P04 intentionally performs its two attempts within one scenario after this fresh start. Closing its context is sufficient cleanup; no scenario depends on another scenario’s logout or state.

The existing `playwright.config.ts` uses the SauceDemo base URL and Chromium Desktop Chrome. Generated automation should retain that configuration and use condition-based waiting for navigation and visible outcomes. Do not use fixed sleeps. Never persist passwords or filled credential values in the plan, screenshots, traces, or logs.

## Previously recorded interface and locator guidance

| Element | Historical locator guidance, pending current verification |
| --- | --- |
| Login form | Existing plan reports role `form`, accessible name `Login`; not required by the seed |
| Username | Role `textbox`, exact name `Username`; `data-test="username"` |
| Password | `data-test="password"` from seed; existing plan reports accessible name `Password`. Password inputs may lack a textbox role; verify label/placeholder before selecting by role |
| Submit | Role `button`, exact name `Login`; `data-test="login-button"` |
| Login error | Visible `h3` with `data-test="error"`; no alert role was assumed |
| Inventory marker | `data-test="title"`, observed visible text `Products` |
| Product catalogue | `data-test="inventory-list"` and visible `data-test="inventory-item"` cards |

The app uses `data-test`, while Playwright’s default test-id attribute is `data-testid`. The existing seed uses explicit `data-test` locators. Reuse the seed’s explicit `data-test` convention for inputs until accessible labels or roles can be inspected. The existing suite uses `getByLabel`; that mapping has not been verified in this run. Prefer the submit button role when confirmed. Do not silently assume `getByTestId` targets `data-test` without configuration. Locator choices must be checked during Generator execution; a failed selector must not change required assertions.

The login page publishes standard and locked-out demo accounts and a shared demo password. The existing plan reports using those public page values for prior exploration; their values are intentionally omitted here. Retrieve them at runtime without logging or persisting them. Browser availability establishes usable exploration data, not requirement-owner approval of account coverage.

## Acceptance criteria — exact specification text

**AC1 — Successful login**

Given I am on the SauceDemo login page  
When I enter valid credentials  
And I click Login  
Then I should be redirected to the inventory page  
And the product catalogue should be visible.

**AC2 — Invalid password**

Given I am on the login page  
When I enter a valid username and an invalid password  
And I click Login  
Then I should remain on the login page  
And an appropriate error message should appear.

**AC3 — Missing credentials**

Given I am on the login page  
When I click Login without entering credentials  
Then I should see a username-required validation message.

**AC4 — Locked-out user**

Given I am on the login page  
When I attempt to log in using the provided locked-out demo account  
Then I should see a locked-out account error.

## Traceability and verification summary

| Scenario | ACs | Type | Source | Priority | Browser verification |
| --- | --- | --- | --- | --- | --- |
| SCRUM-1-S01 | AC1 | positive | acceptance_criteria | high | Historical verification; current blocked |
| SCRUM-1-S02 | AC2 | negative | acceptance_criteria | high | Historical verification; current blocked |
| SCRUM-1-S03 | AC3 | boundary | acceptance_criteria | high | Historical verification; current blocked |
| SCRUM-1-S04 | AC4 | negative | acceptance_criteria | high | Historical verification; current blocked |
| SCRUM-1-P01 | AC3 | boundary | proposed | medium | Not exercised; current blocked |
| SCRUM-1-P02 | AC3 | boundary | proposed | medium | Historical verification; current blocked |
| SCRUM-1-P03 | AC3 | edge | proposed | low | Not exercised; current blocked |
| SCRUM-1-P04 | AC1, AC2 | edge | proposed | medium | Not exercised; current blocked |
| SCRUM-1-P05 | AC1 | edge | proposed | low | Not exercised; current blocked |

Every scenario ID, AC mapping, source, type, priority, and expected-result string is preserved from the specification. Scenario priorities are planning metadata. Proposed scenarios are not additional acceptance criteria.

## Detailed scenarios

### SCRUM-1-S01: Successful login displays the product catalogue

Type: `positive` · Source: `acceptance_criteria` · ACs: AC1 · Priority: high

**Preconditions from the specification**

- The SauceDemo login page is open at https://www.saucedemo.com with no authenticated session.
- A requirement-approved valid account and its valid credentials are available; the account identity and required account coverage need confirmation. Credential values must not be stored in this specification.

Apply the independent fresh-context starting state above. The following steps refine execution using observed controls without changing the required outcome.

**Steps**

1. Obtain the published standard demo account and its password from the login page guidance without writing their values into the plan or execution logs.
2. Fill Username and Password, then click the Login button.
3. Wait for navigation to the inventory page and for the product catalogue to become visible. Confirm the Products marker and inventory list are displayed.

**Expected result — preserved verbatim**

I should be redirected to the inventory page and the product catalogue should be visible.

**Historical browser observation — not reverified in this run**

Verified on 2026-11-04: navigation reached https://www.saucedemo.com/inventory.html. The Products marker and inventory list were visible, with six product cards. Six products and their identities are observations only; no fixed count, prices, images, or particular product is added to AC1.

**Success criteria and failure conditions**

The stated outcome is met when valid-credential submission redirects to inventory and a visible product catalogue is present. Failure conditions: no inventory redirection, or no visible catalogue. A fixed product count is not a requirement.

### SCRUM-1-S02: Invalid password is rejected on the login page

Type: `negative` · Source: `acceptance_criteria` · ACs: AC2 · Priority: high

**Preconditions from the specification**

- The SauceDemo login page is open at https://www.saucedemo.com with no authenticated session.
- A valid username and a deliberately invalid password are available without persisting their values.

Apply the independent fresh-context starting state above. The following steps refine execution using observed controls without changing the required outcome.

**Steps**

1. Obtain the published standard demo username from the login page guidance.
2. Fill Username with that valid username and Password with a deliberately nonempty invalid value; do not persist credential values.
3. Click Login. Wait for the login form error and inspect its meaning.
4. Confirm the login page remains displayed; record the observed error text without making its exact wording a new requirement.

**Expected result — preserved verbatim**

I should remain on the login page and an appropriate error message should appear. The meaning of an appropriate error needs clarification; no exact wording is prescribed.

**Historical browser observation — not reverified in this run**

Verified in a fresh isolated browser context on 2026-11-04: remained at https://www.saucedemo.com/ with the login form and visible error: “Epic sadface: Username and password do not match any user in this service”. This is an observed authentication-failure message; the requirement owner still defines what “appropriate” means. The exact copy is not promoted to a requirement.

**Success criteria and failure conditions**

The stated outcome requires remaining on the login page and an appropriate error. Failure conditions include unexpected authenticated navigation or an absent error. Final judgment about message appropriateness awaits clarification; do not substitute observed copy for an approved requirement.

### SCRUM-1-S03: Both credentials empty triggers username-required validation

Type: `boundary` · Source: `acceptance_criteria` · ACs: AC3 · Priority: high

**Preconditions from the specification**

- The SauceDemo login page is open at https://www.saucedemo.com with no authenticated session.
- Both username and password fields are empty, with zero characters in each.

Apply the independent fresh-context starting state above. The following steps refine execution using observed controls without changing the required outcome.

**Steps**

1. Confirm Username and Password both contain zero characters.
2. Click Login without entering any credentials.
3. Inspect the validation message for username-required meaning. Record navigation separately; AC3 does not prescribe it.

**Expected result — preserved verbatim**

I should see a username-required validation message.

**Historical browser observation — not reverified in this run**

Verified on 2026-11-04 with both input lengths zero: remained at https://www.saucedemo.com/ and displayed “Epic sadface: Username is required”. This matches the required username-required meaning. Remaining on the login page and this exact copy are observations, not additional AC3 assertions.

**Success criteria and failure conditions**

The stated outcome is met when the message communicates that the username is required. Failure conditions: no validation message, or a message that does not communicate username-required meaning.

### SCRUM-1-S04: Locked-out demo account displays a locked-account error

Type: `negative` · Source: `acceptance_criteria` · ACs: AC4 · Priority: high

**Preconditions from the specification**

- The SauceDemo login page is open at https://www.saucedemo.com with no authenticated session.
- The provided locked-out demo account and the credentials needed to attempt login have been identified and confirmed; those details are not supplied in SCRUM-1.

Apply the independent fresh-context starting state above. The following steps refine execution using observed controls without changing the required outcome.

**Steps**

1. Obtain the published locked-out demo account and the shared demo password from the page guidance without persisting their values. This is the browser-verified exploration data choice, pending requirement-owner confirmation.
2. Fill Username and Password with those demo values and click Login. Clicking Login is the observed submission method, not an added AC4 requirement.
3. Inspect the resulting message for locked-out-account meaning. Record the destination separately; AC4 does not prescribe it.

**Expected result — preserved verbatim**

I should see a locked-out account error.

**Historical browser observation — not reverified in this run**

Verified in a fresh isolated browser context on 2026-11-04 using the page-published locked-out account and demo password, submitted by clicking Login: remained at https://www.saucedemo.com/ and displayed “Epic sadface: Sorry, this user has been locked out.” This matches locked-out-account meaning. The exact copy and retained destination are observations only.

**Success criteria and failure conditions**

The stated outcome is met when an error communicates that the account is locked out. Failure conditions: no error, or an error without locked-out-account meaning. Confirm the intended demo account before treating exploratory data selection as requirement-approved coverage.

### SCRUM-1-P01: Proposed: submit a valid username with an empty password

Type: `boundary` · Source: `proposed` · ACs: AC3 · Priority: medium

**Preconditions from the specification**

- The SauceDemo login page is open with no authenticated session.
- A valid username is available and the password field is empty.

Apply the independent fresh-context starting state above. The following steps refine execution using observed controls without changing the required outcome.

**Steps**

1. Obtain the published standard demo username and enter it in Username.
2. Leave Password empty at zero characters and click Login.
3. Record the message and destination for requirements clarification without an application pass/fail verdict.

**Expected result — preserved verbatim**

Unspecified: AC3 defines the result only when no credentials are entered. Record observations without assigning a pass/fail outcome until the password-only omission requirement is supplied.

**Historical browser observation — not reverified in this run**

Not exercised in the prior plan or this run. Current browser access is blocked; no browser outcome is claimed.

**Success criteria and failure conditions**

Exploration is complete when the inputs, submission method, destination, and response are recorded without disclosing credentials. No application pass/fail criterion exists for the unspecified behavior. If the flow cannot be exercised, record the setup or interaction failure as an investigation limitation; do not invent a required outcome.

### SCRUM-1-P02: Proposed: submit a password with an empty username

Type: `boundary` · Source: `proposed` · ACs: AC3 · Priority: medium

**Preconditions from the specification**

- The SauceDemo login page is open with no authenticated session.
- A demo password is available and the username field is empty.

Apply the independent fresh-context starting state above. The following steps refine execution using observed controls without changing the required outcome.

**Steps**

1. Leave Username empty at zero characters.
2. Obtain the shared demo password from the page guidance and enter it in Password without persisting its value.
3. Click Login and record the response and destination without assuming the both-empty AC3 result applies.

**Expected result — preserved verbatim**

Unspecified: AC3 does not define the result when only the username is missing. Record observations without assuming that the both-empty validation also applies here.

**Historical browser observation — not reverified in this run**

Explored on 2026-11-04 with Username empty and the page-published demo password entered: remained at https://www.saucedemo.com/ and displayed “Epic sadface: Username is required”. This additional state is outside AC3’s both-empty wording and remains proposed despite matching its observed message.

**Success criteria and failure conditions**

Exploration is complete when the inputs, submission method, destination, and response are recorded without disclosing credentials. No application pass/fail criterion exists for the unspecified behavior. If the flow cannot be exercised, record the setup or interaction failure as an investigation limitation; do not invent a required outcome.

### SCRUM-1-P03: Proposed: submit whitespace-only credential fields

Type: `edge` · Source: `proposed` · ACs: AC3 · Priority: low

**Preconditions from the specification**

- The SauceDemo login page is open with no authenticated session.
- Whitespace handling has not been specified.

Apply the independent fresh-context starting state above. The following steps refine execution using observed controls without changing the required outcome.

**Steps**

1. Enter exactly one ordinary space in Username and one ordinary space in Password.
2. Click Login.
3. Record the response and destination. Do not infer trimming or normalization rules from an unspecified requirement.

**Expected result — preserved verbatim**

Unspecified: the requirements do not say whether whitespace is trimmed, treated as missing credentials, or processed as entered. Observe the response without assuming a required error or normalization rule.

**Historical browser observation — not reverified in this run**

Not exercised in the prior plan or this run. Current browser access is blocked; no browser outcome is claimed.

**Success criteria and failure conditions**

Exploration is complete when the inputs, submission method, destination, and response are recorded without disclosing credentials. No application pass/fail criterion exists for the unspecified behavior. If the flow cannot be exercised, record the setup or interaction failure as an investigation limitation; do not invent a required outcome.

### SCRUM-1-P04: Proposed: correct an invalid password and retry login

Type: `edge` · Source: `proposed` · ACs: AC1, AC2 · Priority: medium

**Preconditions from the specification**

- The SauceDemo login page is open with no authenticated session.
- A valid account, its valid credentials, and a deliberately invalid password are available without persisting their values.

Apply the independent fresh-context starting state above. The following steps refine execution using observed controls without changing the required outcome.

**Steps**

1. Obtain the published standard demo account and its valid password without persisting their values.
2. Enter its valid username with a deliberately invalid password and click Login.
3. Record the error and destination. If the login form remains available, replace the password with the valid demo password and click Login again in this same scenario.
4. Record the destination, catalogue visibility, and handling of the prior error. If the login form is unavailable, record that observation and stop rather than inventing recovery steps.

**Expected result — preserved verbatim**

Exploratory sequence only: AC2 specifies remaining on the login page with an appropriate error for the invalid attempt; AC1 specifies inventory redirection and a visible product catalogue for valid credentials. Whether retrying in the same session is supported and how the previous error is handled are unspecified. Record observations without assigning a pass/fail outcome to these unspecified behaviors.

**Historical browser observation — not reverified in this run**

Not exercised in the prior plan or this run. Current browser access is blocked; no browser outcome is claimed.

**Success criteria and failure conditions**

Exploration is complete when the inputs, submission method, destination, and response are recorded without disclosing credentials. No application pass/fail criterion exists for the unspecified behavior. If the flow cannot be exercised, record the setup or interaction failure as an investigation limitation; do not invent a required outcome.

### SCRUM-1-P05: Proposed: attempt login with keyboard submission

Type: `edge` · Source: `proposed` · ACs: AC1 · Priority: low

**Preconditions from the specification**

- The SauceDemo login page is open with no authenticated session.
- Valid credentials are available; keyboard submission behavior is not specified.

Apply the independent fresh-context starting state above. The following steps refine execution using observed controls without changing the required outcome.

**Steps**

1. Obtain the published standard demo account and its valid password without persisting their values.
2. Fill Username and Password.
3. Keep focus in Password and press Enter instead of clicking Login.
4. Record whether submission occurs, the destination, and visible content without a required pass/fail verdict.

**Expected result — preserved verbatim**

Unspecified: AC1 explicitly uses clicking Login and does not require Enter-key submission. Record observations; do not assume keyboard submission must occur or apply a pass/fail result without an approved requirement.

**Historical browser observation — not reverified in this run**

Not exercised in the prior plan or this run. Current browser access is blocked; no browser outcome is claimed.

**Success criteria and failure conditions**

Exploration is complete when the inputs, submission method, destination, and response are recorded without disclosing credentials. No application pass/fail criterion exists for the unspecified behavior. If the flow cannot be exercised, record the setup or interaction failure as an investigation limitation; do not invent a required outcome.

## Requirements versus observed behavior

| Requirement or gap | Observed behavior | Interpretation |
| --- | --- | --- |
| AC1 inventory redirection and visible catalogue | `/inventory.html`, Products marker, visible list with six cards | Consistent for the explored standard demo account. The route and markers are verified implementation identifiers; fixed product count and content are not new requirements. |
| AC2 remain on login page and show an appropriate error | Stayed at `/`; authentication mismatch error appeared in a fresh isolated context | No confirmed contradiction. Exact copy and acceptable message meaning remain separate from the unspecified word “appropriate”. |
| AC3 no credentials entered | Username-required error with both inputs empty | Consistent with AC3. |
| AC4 provided locked-out demo account | Page-published locked-out account and demo password, clicked Login; locked-out error appeared | Consistent with AC4’s required meaning for the explored account. Account/password/submission details are observed choices rather than new requirements. |
| P02 password entered but username empty | Same username-required error | Additional behavior outside AC3’s both-empty state; still proposed. |
| P01/P03/P04/P05 | Not exercised | No observed outcomes claimed and no expected behavior invented. |

The existing plan reported no confirmed requirements discrepancy in its fresh-state core flows. No current browser check succeeded. During earlier exploration in a reused browser context, nonempty invalid-password and locked-out submissions stayed on the login page without a visible error; one invalid-password attempt timed out waiting 30 seconds for the error. Repeating both flows in separate new isolated contexts produced the errors recorded above. This is an inconclusive exploration anomaly, not a resolved application defect or evidence that expected results should change. Preserve the fresh-context setup and capture evidence if it recurs.

Third-party telemetry requests also returned 401 responses during exploration. They were not treated as authentication assertions or as an explanation for the reused-context anomaly.

## Residual planning questions and generation guidance

The JSON currently declares `ready` with no ambiguities, but the following questions remain in its scenario wording. This plan records them without editing the specification or asserting that the validator currently blocks it.

1. Confirm the intended valid account and required account coverage for AC1/AC2. The explored page-published standard account does not establish that every accepted account is in scope.
2. Clarify the acceptable meaning of “appropriate error message” in AC2. Preserve its expected result and do not require exact observed copy unless approved.
3. Confirm the intended provided locked-out account, password source, and submission method for AC4. Exploration demonstrated a usable page-published combination; it does not amend the requirement.
4. Confirm that the observed inventory route and visible catalogue markers are acceptable ways to identify AC1’s stated outcome. Do not add product counts, prices, images, or exact identities.
5. P01–P05 remain proposed. Define and approve expected behavior before promoting any of their unspecified outcomes to application assertions. No credential-length limits are supplied.

The specification validator succeeded with status `ready`, nine scenarios, and all four ACs mapped, using `node --import tsx orchestrator/validate-spec.ts tests/specifications/QA-1.json`. The npm wrapper hit a sandbox IPC permission error; the direct command executes the same TypeScript validator.

The current user request includes test generation. The Generator should preserve all nine scenario IDs, AC mappings, preconditions, and expected-result strings in `tests/e2e/QA-1.spec.ts`, using independent contexts and the supplied seed structure. S01 must assert inventory redirection and visible catalogue; S02 must assert retained login page and visible error, recording the residual semantic review for “appropriate”; S03 must assert username-required meaning; S04 must assert locked-out-account meaning. Do not replace semantic assertions with exact observed copy, fixed catalogue counts, or unrelated outcomes. P01–P05 must execute and attach sanitized observations without assigning application pass/fail verdicts to unspecified behavior. They must not be skipped or promoted to approved requirements.

Fresh selector and flow verification remains blocked by Playwright MCP approval policy. Report that limitation explicitly if it cannot be resolved. A subsequent execution must record actual test outcomes and unresolved failures; it cannot use the historical browser claims above as proof of current execution.

## Generation and execution evidence — 2026-11-04

The official Playwright Generator updated `tests/e2e/QA-1.spec.ts`. Its setup/log/write tools were unavailable, so the file was saved through filesystem tooling. All nine source scenario IDs and required assertions were retained. Source preconditions and expected results are included as test annotations. Proposed scenarios collect observations without asserting unspecified outcomes. The generator did not obtain fresh browser verification.

- Specification validation: passed (`ready`, nine scenarios, four of four ACs mapped).
- `npm run typecheck`: passed after generation.
- `npx playwright test tests/e2e/QA-1.spec.ts --list`: discovered all nine scenarios.
- `npx playwright test tests/e2e/QA-1.spec.ts --workers=1`: exit code 1; nine failed, zero passed, zero skipped. Every failure occurred during `browserType.launch`, before page creation or application assertions.
- Chromium launch evidence: `bootstrap_check_in org.chromium.Chromium.MachPortRendezvousServer.<pid>: Permission denied (1100)`, followed by browser termination with `SIGTRAP`. This is an environment restriction; application behavior remains unverified.
- HTML report: [playwright-report/index.html](../playwright-report/index.html). Per-scenario launch evidence is stored under `test-results/*/error-context.md`. These generated directories are ignored by Git.

No Healer repair was attempted: the failures precede test setup and provide no evidence of a locator, setup-code, or application defect. Rerun the command in an environment permitted to launch Chromium, then complete the Planner/Generator browser verification when MCP access is available. No requirements, source plan, seed, shared configuration, commits, or pull requests were changed by this work.
