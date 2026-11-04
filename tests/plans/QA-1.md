# Test Plan: SCRUM-1

## Test SauceDemo User Login

Application: https://www.saucedemo.com

## Acceptance Criteria

- **AC1:** **AC1 — Successful login**

Given I am on the SauceDemo login page  
When I enter valid credentials  
And I click Login  
Then I should be redirected to the inventory page  
And the product catalogue should be visible.
- **AC2:** **AC2 — Invalid password**

Given I am on the login page  
When I enter a valid username and an invalid password  
And I click Login  
Then I should remain on the login page  
And an appropriate error message should appear.
- **AC3:** **AC3 — Missing credentials**

Given I am on the login page  
When I click Login without entering credentials  
Then I should see a username-required validation message.
- **AC4:** **AC4 — Locked-out user**

Given I am on the login page  
When I attempt to log in using the provided locked-out demo account  
Then I should see a locked-out account error.

## Test Scenarios

### SCRUM-1-S01: Successful login displays the product catalogue

- Type: positive
- Source: acceptance_criteria
- ACs: AC1
- Priority: high

**Preconditions**
- The SauceDemo login page is open at https://www.saucedemo.com with no authenticated session.
- A requirement-approved valid account and its valid credentials are available; the account identity and required account coverage need confirmation. Credential values must not be stored in this specification.

**Steps**
1. Enter valid credentials.
2. Click Login.
3. Check the destination and whether the product catalogue is visible.

**Expected result:** I should be redirected to the inventory page and the product catalogue should be visible.

### SCRUM-1-S02: Invalid password is rejected on the login page

- Type: negative
- Source: acceptance_criteria
- ACs: AC2
- Priority: high

**Preconditions**
- The SauceDemo login page is open at https://www.saucedemo.com with no authenticated session.
- A valid username and a deliberately invalid password are available without persisting their values.

**Steps**
1. Enter a valid username and an invalid password.
2. Click Login.
3. Check whether the login page remains displayed and inspect the error message.

**Expected result:** I should remain on the login page and an appropriate error message should appear. The meaning of an appropriate error needs clarification; no exact wording is prescribed.

### SCRUM-1-S03: Both credentials empty triggers username-required validation

- Type: boundary
- Source: acceptance_criteria
- ACs: AC3
- Priority: high

**Preconditions**
- The SauceDemo login page is open at https://www.saucedemo.com with no authenticated session.
- Both username and password fields are empty, with zero characters in each.

**Steps**
1. Click Login without entering credentials.
2. Inspect the validation message.

**Expected result:** I should see a username-required validation message.

### SCRUM-1-S04: Locked-out demo account displays a locked-account error

- Type: negative
- Source: acceptance_criteria
- ACs: AC4
- Priority: high

**Preconditions**
- The SauceDemo login page is open at https://www.saucedemo.com with no authenticated session.
- The provided locked-out demo account and the credentials needed to attempt login have been identified and confirmed; those details are not supplied in SCRUM-1.

**Steps**
1. Attempt to log in using the provided locked-out demo account, with credential and submission details to be confirmed before execution.
2. Inspect the resulting error.

**Expected result:** I should see a locked-out account error.

### SCRUM-1-P01: Proposed: submit a valid username with an empty password

- Type: boundary
- Source: proposed
- ACs: AC3
- Priority: medium

**Preconditions**
- The SauceDemo login page is open with no authenticated session.
- A valid username is available and the password field is empty.

**Steps**
1. Enter the valid username and leave the password at zero characters.
2. Click Login.
3. Record the displayed response and destination for requirements clarification.

**Expected result:** Unspecified: AC3 defines the result only when no credentials are entered. Record observations without assigning a pass/fail outcome until the password-only omission requirement is supplied.

### SCRUM-1-P02: Proposed: submit a password with an empty username

- Type: boundary
- Source: proposed
- ACs: AC3
- Priority: medium

**Preconditions**
- The SauceDemo login page is open with no authenticated session.
- A demo password is available and the username field is empty.

**Steps**
1. Enter the password and leave the username at zero characters.
2. Click Login.
3. Record the displayed response and destination for requirements clarification.

**Expected result:** Unspecified: AC3 does not define the result when only the username is missing. Record observations without assuming that the both-empty validation also applies here.

### SCRUM-1-P03: Proposed: submit whitespace-only credential fields

- Type: edge
- Source: proposed
- ACs: AC3
- Priority: low

**Preconditions**
- The SauceDemo login page is open with no authenticated session.
- Whitespace handling has not been specified.

**Steps**
1. Enter one space in each credential field.
2. Click Login.
3. Record the displayed response and destination for requirements clarification.

**Expected result:** Unspecified: the requirements do not say whether whitespace is trimmed, treated as missing credentials, or processed as entered. Observe the response without assuming a required error or normalization rule.

### SCRUM-1-P04: Proposed: correct an invalid password and retry login

- Type: edge
- Source: proposed
- ACs: AC1, AC2
- Priority: medium

**Preconditions**
- The SauceDemo login page is open with no authenticated session.
- A valid account, its valid credentials, and a deliberately invalid password are available without persisting their values.

**Steps**
1. Enter the valid username and invalid password, then click Login.
2. Record the error and destination.
3. On the login page, replace the invalid password with the valid password and click Login again.
4. Record the destination, catalogue visibility, and handling of the prior error.

**Expected result:** Exploratory sequence only: AC2 specifies remaining on the login page with an appropriate error for the invalid attempt; AC1 specifies inventory redirection and a visible product catalogue for valid credentials. Whether retrying in the same session is supported and how the previous error is handled are unspecified. Record observations without assigning a pass/fail outcome to these unspecified behaviors.

### SCRUM-1-P05: Proposed: attempt login with keyboard submission

- Type: edge
- Source: proposed
- ACs: AC1
- Priority: low

**Preconditions**
- The SauceDemo login page is open with no authenticated session.
- Valid credentials are available; keyboard submission behavior is not specified.

**Steps**
1. Enter valid credentials.
2. With focus in the password field, press Enter.
3. Record whether submission occurs and the resulting destination and visible content.

**Expected result:** Unspecified: AC1 explicitly uses clicking Login and does not require Enter-key submission. Record observations; do not assume keyboard submission must occur or apply a pass/fail result without an approved requirement.
