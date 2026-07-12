# JOI Delivery — Code Smells & Bugs

Living notes for pairing prep. Add items as you find them. Prefer facts over speculation.

**Legend:** `bug` = incorrect/broken behavior · `smell` = design/maintainability issue · `stub` = intentionally unfinished · `docs` = README/code mismatch

---

## Seed & users


| ID  | Type      | Location                                                      | Issue                                                                           | Notes                                                                                                                   |
| --- | --------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| S1  | bug       | `[seedData.js](src/seedData/seedData.js)` `createCartForUser` | Third arg to `Cart` should be a `User` object; currently passes `userId` string | `Cart` JSDoc/constructor expect `User`. Fix: pass `SeedData.user101` / `user102` (or change signature to accept `user`) |
| S2  | bug (was) | `[seedData.js](src/seedData/seedData.js)` `SeedData.users`    | Originally only `[user101]` while `cartForUsers` had `user102`                  | Viewing cart for `user102` → `fetchUserById` returns `null` → crash. Partially addressed if `user102` is now in `users` |
| S3  | smell     | `[seedData.js](src/seedData/seedData.js)` `createCartForUser` | Params `userId`, `firstName`, `lastName` unused / misleading                    | Signature doesn’t match what `Cart` needs                                                                               |
| S4  | smell     | `[seedData.js](src/seedData/seedData.js)` `createStore`       | Always sets description `"Premium grocery store"`                               | `store102` “Natural Choice” gets wrong description vs README                                                            |


---



## Cart flow


| ID  | Type  | Location                                                                  | Issue                                         | Notes                                                                                                                       |
| --- | ----- | ------------------------------------------------------------------------- | --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| C1  | bug   | `[cartService.js](src/services/cartService.js)` `fetchCartForUser`        | No null-check on `user`                       | Unknown/missing user → `Cannot read properties of null (reading 'userId')` (500). Should return 404 / empty / guarded error |
| C2  | bug   | `[cartService.js](src/services/cartService.js)` `addProductToCartForUser` | No guard if user, cart, or product is missing | Can throw when pushing onto undefined cart or product                                                                       |
| C3  | smell | `[cartService.js](src/services/cartService.js)`                           | No quantity handling                          | Test body includes `quantity: 2` but service always `push`es one product instance                                           |
| C4  | smell | `[domain/cart.js](src/domain/cart.js)`                                    | Cart has no totals, line items, or quantity   | Only a flat `products[]`                                                                                                    |
| C5  | smell | Controllers                                                               | Always `200`                                  | No validation, no 4xx for bad input                                                                                         |


---



## Inventory


| ID  | Type  | Location                                                                     | Issue                                                       | Notes                                                                             |
| --- | ----- | ---------------------------------------------------------------------------- | ----------------------------------------------------------- | --------------------------------------------------------------------------------- |
| I1  | stub  | `[inventoryController.js](src/controllers/inventoryController.js)`           | Returns `{}`                                                | README: “to be implemented.” Likely pairing story                                 |
| I2  | stub  | `[inventoryController.test.js](src/controllers/inventoryController.test.js)` | Comments: “add required mocking” / “put meaning assertions” | Unfinished TDD surface                                                            |
| I3  | docs  | README vs controller                                                         | README query `storeid`; code reads `storeId`                | Wrong casing → `storeId` undefined in handler                                     |
| I4  | smell | `[groceryStore.js](src/domain/groceryStore.js)`                              | `inventory` is always empty `Set`                           | Products live only in `SeedData.groceryProducts`, never linked to store inventory |


---



## Domain / inheritance


| ID  | Type  | Location                                                                                   | Issue                                                                                   | Notes                                                                         |
| --- | ----- | ------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| D1  | bug   | `[foodProduct.js](src/domain/foodProduct.js)`, `[restaurant.js](src/domain/restaurant.js)` | `const { Product } = require(...)` / `{ Outlet }` but modules export the class directly | Named destructure → `undefined`; subclassing broken if these files are loaded |
| D2  | stub  | `FoodProduct`, `Restaurant`                                                                | Empty subclasses                                                                        | Scaffold for food side; seed is grocery-only                                  |
| D3  | smell | Product hierarchy                                                                          | `GroceryProduct` has stock/threshold; unused for health API                             | Domain hints at inventory health logic that isn’t wired                       |


---



## API / product lookup


| ID  | Type  | Location                                              | Issue                                                            | Notes                       |
| --- | ----- | ----------------------------------------------------- | ---------------------------------------------------------------- | --------------------------- |
| P1  | smell | `[productService.js](src/services/productService.js)` | Returns `undefined` when not found; callers don’t handle it      |                             |
| P2  | smell | Seed products                                         | All products on `store101` only                                  | No inventory for `store102` |
| P3  | docs  | README sample response                                | Example shows `product103` / Crackers for an add of `product101` | Sample may be stale/wrong   |


---



## How to use this in the interview

1. Don’t dump the whole list — pick 1–2 relevant smells when designing a change.
2. Prefer fixing smells that unblock the story (e.g. null user → clear 404) over drive-by cleanups.
3. When you spot something new, add a row here after the session.

---



## Changelog


| Date       | Change                                                                   |
| ---------- | ------------------------------------------------------------------------ |
| 2026-07-12 | Initial list from README walkthrough + cart/view `user102` investigation |


