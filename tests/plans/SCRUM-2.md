# Test Plan: SCRUM-2

## Test Shopping Cart Functionality

Application: https://www.saucedemo.com/

## Acceptance Criteria

- **AC1:** The user can add a product to the cart.
- **AC2:** The cart badge updates to show the number of items.
- **AC3:** The user can view added products on the cart page.
- **AC4:** The user can remove a product from the cart.
- **AC5:** When a user removes a product from the shopping cart: if other products remain, the cart badge displays the number of remaining products; if the last product is removed, the cart badge disappears; the removed product must no longer appear in the cart.

## Test Scenarios

### SCRUM-2-S01: Add the first product to an empty cart

- Type: boundary
- Source: acceptance_criteria
- ACs: AC1, AC2, AC3
- Priority: medium

**Preconditions**
- A customer session able to access shopping functionality is available; the setup method must be verified before execution.
- The cart is empty and an available product A has been identified. Product names and UI controls have not been verified in this analysis.

**Steps**
1. Add product A to the cart using the application's supported action.
2. Inspect the cart badge.
3. Open the cart page and inspect its products.

**Expected result:** Product A is added and is visible on the cart page. The cart badge shows an item count of 1.

### SCRUM-2-S02: Adding a second distinct product increases the badge count

- Type: positive
- Source: acceptance_criteria
- ACs: AC1, AC2
- Priority: medium

**Preconditions**
- A customer session able to access shopping functionality is available.
- The cart contains only product A, added once, and the badge shows 1.
- A distinct available product B has been identified.

**Steps**
1. Add product B to the cart using the application's supported action.
2. Inspect the cart badge.
3. Open the cart page and confirm product B is present.

**Expected result:** Product B is added to the cart and the badge shows an item count of 2.

### SCRUM-2-S03: View multiple added products on the cart page

- Type: positive
- Source: acceptance_criteria
- ACs: AC3
- Priority: medium

**Preconditions**
- A customer session able to access shopping functionality is available.
- Two distinct products A and B have each been added once to an initially empty cart. Their identities were recorded when selected.

**Steps**
1. Open the cart page using the application's supported navigation.
2. Compare the displayed products with the identities of products A and B.

**Expected result:** Both added products A and B are visible on the cart page.

### SCRUM-2-S04: Remove one product while another remains in the cart

- Type: positive
- Source: acceptance_criteria
- ACs: AC3, AC4, AC5
- Priority: medium

**Preconditions**
- A customer session able to access shopping functionality is available.
- The cart contains only distinct products A and B, each added once.

**Steps**
1. Remove product A using the application's supported removal action.
2. View the cart page and inspect the products present.

**Expected result:** Product A is no longer in the cart. Product B remains visible on the cart page.

### SCRUM-2-S05: Removing one of two products decreases the badge count

- Type: positive
- Source: acceptance_criteria
- ACs: AC4, AC5
- Priority: medium

**Preconditions**
- A customer session able to access shopping functionality is available.
- The cart contains only distinct products A and B, each added once, and the badge shows 2.

**Steps**
1. Remove product A using the application's supported removal action.
2. Inspect the cart badge.
3. View the cart page and confirm product A is no longer present.

**Expected result:** Product A no longer appears in the cart and the cart badge displays the remaining product count of 1.

### SCRUM-2-S06: Remove the last product and verify the cart badge disappears

- Type: boundary
- Source: acceptance_criteria
- ACs: AC4, AC5
- Priority: medium

**Preconditions**
- A customer session able to access shopping functionality is available.
- The cart contains only product A, added once, and the badge shows 1.

**Steps**
1. Remove product A using the application's supported removal action.
2. View the cart page to confirm product A is no longer present.
3. Verify that the cart badge has disappeared after removal.

**Expected result:** Product A no longer appears in the cart, the cart has no products, and the cart badge disappears.
