# Test Plan: SCRUM-5

## Test Product Sorting on the Inventory Page

Application: https://www.saucedemo.com/

## Acceptance Criteria

- **AC1:** Given the customer has successfully logged in, when the inventory page is displayed, all six inventory products are visible, the sorting dropdown displays Name (A to Z), and products are displayed in ascending alphabetical order by name.
- **AC2:** Given the customer is viewing the inventory page, when the customer selects Name (Z to A) from the sorting dropdown, all six products remain visible, product names are displayed in descending alphabetical order, and the sorting dropdown displays Name (Z to A).
- **AC3:** Given the customer is viewing the inventory page, when the customer selects Price (low to high), all six products remain visible, product prices are displayed in ascending numerical order, the lowest-priced product appears first, and the sorting dropdown displays Price (low to high).
- **AC4:** Given the customer is viewing the inventory page, when the customer selects Price (high to low), all six products remain visible, product prices are displayed in descending numerical order, the highest-priced product appears first, and the sorting dropdown displays Price (high to low).
- **AC5:** Given the customer is viewing the inventory page, when the customer selects Price (high to low) and subsequently selects Name (A to Z), the final product order is ascending alphabetically by name, all six products remain visible, no products are duplicated or removed, and the sorting dropdown displays Name (A to Z).
- **AC6:** Given the customer has added Sauce Labs Backpack to the shopping cart and the shopping cart badge displays 1, when the customer changes the sorting option to Price (low to high), the inventory products are correctly sorted by ascending price, the shopping cart badge still displays 1, Sauce Labs Backpack remains in the shopping cart, and no additional products are added.

## Test Scenarios

### SCRUM-5-S01: Default inventory order is Name (A to Z) after login

- Type: positive
- Source: acceptance_criteria
- ACs: AC1
- Priority: medium

**Preconditions**
- Run independently in Chromium using the existing test configuration and authentication approach.
- Start a fresh authenticated session as standard_user using the existing configured test credential, with an empty shopping cart.

**Steps**
1. View the inventory page immediately after successful login without changing the sorting option.
2. Verify that all six inventory products are visible.
3. Verify that the sorting dropdown displays Name (A to Z).
4. Extract the displayed product names in their current order and compare them with an independently alphabetically ascending sorted copy; do not hardcode the expected product sequence.

**Expected result:** All six inventory products are visible, the sorting dropdown displays Name (A to Z), and the displayed names match their independently computed ascending alphabetical order.

### SCRUM-5-S02: Sort all inventory products by name from Z to A

- Type: positive
- Source: acceptance_criteria
- ACs: AC2
- Priority: medium

**Preconditions**
- Run independently in Chromium using the existing test configuration and authentication approach.
- Start a fresh authenticated session as standard_user using the existing configured test credential, with an empty shopping cart.
- The customer is viewing the inventory page with all six inventory products displayed.

**Steps**
1. Select Name (Z to A) from the sorting dropdown.
2. Verify that the sorting dropdown displays Name (Z to A) and that all six products remain visible.
3. Extract the displayed product names in their current order and compare them with an independently alphabetically descending sorted copy; do not hardcode the expected product sequence.

**Expected result:** All six products remain visible, the displayed names match their independently computed descending alphabetical order, and the sorting dropdown displays Name (Z to A).

### SCRUM-5-S03: Sort inventory prices from low to high with the minimum first

- Type: positive
- Source: acceptance_criteria
- ACs: AC3
- Priority: medium

**Preconditions**
- Run independently in Chromium using the existing test configuration and authentication approach.
- Start a fresh authenticated session as standard_user using the existing configured test credential, with an empty shopping cart.
- The customer is viewing the inventory page with all six inventory products displayed.

**Steps**
1. Select Price (low to high) from the sorting dropdown.
2. Verify that the sorting dropdown displays Price (low to high) and that all six products remain visible.
3. Extract the displayed product prices in their current order and parse them into numerical values.
4. Compare the numerical prices with an independently numerically ascending sorted copy and verify that the first product has the minimum price; do not hardcode the expected price sequence.

**Expected result:** All six products remain visible, their prices are in ascending numerical order, the lowest-priced product appears first, and the sorting dropdown displays Price (low to high).

### SCRUM-5-S04: Sort inventory prices from high to low with the maximum first

- Type: positive
- Source: acceptance_criteria
- ACs: AC4
- Priority: medium

**Preconditions**
- Run independently in Chromium using the existing test configuration and authentication approach.
- Start a fresh authenticated session as standard_user using the existing configured test credential, with an empty shopping cart.
- The customer is viewing the inventory page with all six inventory products displayed.

**Steps**
1. Select Price (high to low) from the sorting dropdown.
2. Verify that the sorting dropdown displays Price (high to low) and that all six products remain visible.
3. Extract the displayed product prices in their current order and parse them into numerical values.
4. Compare the numerical prices with an independently numerically descending sorted copy and verify that the first product has the maximum price; do not hardcode the expected price sequence.

**Expected result:** All six products remain visible, their prices are in descending numerical order, the highest-priced product appears first, and the sorting dropdown displays Price (high to low).

### SCRUM-5-S05: Switch from descending price to ascending name without losing or duplicating products

- Type: positive
- Source: acceptance_criteria
- ACs: AC4, AC5
- Priority: medium

**Preconditions**
- Run independently in Chromium using the existing test configuration and authentication approach.
- Start a fresh authenticated session as standard_user using the existing configured test credential, with an empty shopping cart.
- The customer is viewing the inventory page with all six inventory products displayed.

**Steps**
1. Record the six displayed product names and their occurrence counts before changing the sort option.
2. Select Price (high to low) and verify that the dropdown displays Price (high to low).
3. Verify that all six products remain visible; parse their prices into numbers and compare their order with an independently numerically descending sorted copy, including the maximum price first.
4. Subsequently select Name (A to Z) and verify that the dropdown displays Name (A to Z).
5. Verify that all six products remain visible and compare their names with an independently alphabetically ascending sorted copy.
6. Compare the final product names and occurrence counts with the recorded initial inventory to detect removed or duplicated products; do not hardcode the expected product or price sequences.

**Expected result:** After Price (high to low), prices are in descending numerical order with the highest first and the selected option is displayed. After the subsequent change, the final order is ascending alphabetically by name and the dropdown displays Name (A to Z). All six original products remain visible with no products duplicated or removed.

### SCRUM-5-S06: Sorting by ascending price preserves the single backpack in the cart

- Type: positive
- Source: acceptance_criteria
- ACs: AC3, AC6
- Priority: medium

**Preconditions**
- Run independently in Chromium using the existing test configuration and authentication approach.
- Start a fresh authenticated session as standard_user using the existing configured test credential, with an empty shopping cart.
- The customer is viewing the inventory page with all six inventory products displayed, including Sauce Labs Backpack.

**Steps**
1. Add Sauce Labs Backpack to the initially empty shopping cart using the application's supported action and verify that the cart badge displays 1.
2. Select Price (low to high) from the inventory sorting dropdown.
3. Verify that the dropdown displays Price (low to high) and that all six inventory products remain visible.
4. Extract the displayed prices, parse them into numerical values, and compare them with an independently numerically ascending sorted copy; verify that the minimum price appears first without hardcoding the expected price sequence.
5. Verify that the shopping cart badge still displays 1.
6. Open the shopping cart using the application's supported navigation and verify that it contains only Sauce Labs Backpack, with no additional products; do not complete checkout.

**Expected result:** All six inventory products are sorted by ascending numerical price with the lowest-priced product first, and the dropdown displays Price (low to high). The cart badge remains 1, Sauce Labs Backpack remains the only product in the cart, and no additional products are added.
