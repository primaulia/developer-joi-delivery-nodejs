# JOI Delivery — Code Smells & Bugs

Living notes for pairing prep. Add items as you find them. Prefer facts over speculation.

**Legend:** `bug` = incorrect/broken behavior · `smell` = design/maintainability issue · `stub` = intentionally unfinished · `docs` = README/code mismatch

**Status:** `open` · `fixed` · `partial` · `wip`

---

## Progress snapshot (as of 2026-07-15)

### Done

- **Seed (S1–S5):** users/stores wiring, `createCartForUser(user)`, per-store descriptions, `SeedData.stores`
- **Cart service + tests:** guards, `CartItem` + quantity, `totalPrice`, validation throws with `error.status`
- **Cart controller:** try/catch maps service errors to HTTP for `addProduct`; qty 400 tests
- **Inventory controller + tests:** `storeId` required (400), store missing (404), happy path mocked (200)

### Pause cart here

- C4 leftover: merge same product on re-add (optional)
- C5 leftover: `viewCart` → 404 when null (optional)

### Next session — inventory health (primary pairing story)

1. Fix `findStoreById` → compare `outletId` (I5)
2. Remove `cartService.calculateInventoryHealth` (I6); implement health in `inventoryService`
3. Filter `SeedData.groceryProducts` by store; status from `availableStock` vs `threshold` (I7)
4. Add `inventoryService.test.js` (TDD); then Postman `GET /inventory/health?storeId=store101`
5. Align README `storeid` → `storeId` (I3)

---

## Seed & users

| ID | Status | Type | Location | Issue | Notes |
| ---- | ------ | ---- | -------- | ----- | ----- |
| S1 | fixed | bug | [`seedData.js`](src/seedData/seedData.js) `createCartForUser` | Third arg to `Cart` was a `userId` string | Now `createCartForUser(user, cartId)` passes a `User` object |
| S2 | fixed | bug | [`seedData.js`](src/seedData/seedData.js) `SeedData.users` | Only `[user101]` while `cartForUsers` had `user102` | Now `SeedData.users = [user101, user102]` |
| S3 | fixed | smell | [`seedData.js`](src/seedData/seedData.js) `createCartForUser` | Unused/misleading `(userId, firstName, lastName, cartId)` params | Signature is now `(user, cartId)` |
| S4 | fixed | smell | [`seedData.js`](src/seedData/seedData.js) `createStore` | Always set description `"Premium grocery store"` | Now `createStore(outletName, description, storeId)`; each store has its own description |
| S5 | fixed | smell | [`seedData.js`](src/seedData/seedData.js) | No `SeedData.stores` collection | Added `SeedData.stores = [store101, store102]` for lookup |

---

## Cart flow

| ID | Status | Type | Location | Issue | Notes |
| ---- | ------ | ---- | -------- | ----- | ----- |
| C1 | fixed | bug | [`cartService.js`](src/services/cartService.js) `getCartForUser` | No null-check on `user` before Map lookup | `getCartForUser` now returns `null` if user missing; `fetchCartForUser` uses `?? null` |
| C2 | fixed | bug | [`cartService.js`](src/services/cartService.js) `addProductToCartForUser` | No guard if user, cart, or product is missing | Guards + `error.status`; note: not-found uses 400 (often 404 in APIs) |
| C3 | fixed | smell | [`cartService.js`](src/services/cartService.js) | No quantity handling | Now pushes `CartItem` with `quantity ?? 1` (+ validation) |
| C4 | partial | smell | [`domain/cart.js`](src/domain/cart.js) | Flat `products[]` / no totals | `items` + `totalPrice` done; merge-same-product on re-add still open |
| C5 | partial | smell | Controllers | Error HTTP mapping incomplete | `addProductToCart` try/catch → `error.status`; `viewCart` still 200 when cart/user is `null` (no 404) |

---

## Inventory

| ID | Status | Type | Location | Issue | Notes |
| ---- | ------ | ---- | -------- | ----- | ----- |
| I1 | wip | stub | [`inventoryController.js`](src/controllers/inventoryController.js) / [`inventoryService.js`](src/services/inventoryService.js) | Was returning `{}` | Controller wires 400/404/200; health payload still not real (see I5–I7) |
| I2 | partial | stub | [`inventoryController.test.js`](src/controllers/inventoryController.test.js) | Was unfinished TDD skeleton | Controller happy path + 400/404 cases written; leftover comments; no service tests yet |
| I3 | open | docs | README vs controller | README query `storeid`; code reads `storeId` | Still mismatched — fix README to `storeId` |
| I4 | open | smell | [`groceryStore.js`](src/domain/groceryStore.js) | `inventory` is always empty `Set` | Products still only in `SeedData.groceryProducts` |
| I5 | open | bug | [`inventoryService.js`](src/services/inventoryService.js) `findStoreById` | Compares `store.storeId` | Outlet/GroceryStore use `outletId` — lookup fails against seed |
| I6 | open | bug | [`inventoryService.js`](src/services/inventoryService.js) | Calls `cartService.calculateInventoryHealth` | Method does not exist on cart; health logic belongs in inventory service |
| I7 | open | stub | [`inventoryService.js`](src/services/inventoryService.js) | No real health rule yet | Need filter `groceryProducts` by store + `availableStock` vs `threshold` |

---

## Domain / inheritance

| ID | Status | Type | Location | Issue | Notes |
| ---- | ------ | ---- | -------- | ----- | ----- |
| D1 | open | bug | [`foodProduct.js`](src/domain/foodProduct.js), [`restaurant.js`](src/domain/restaurant.js) | Named destructure of default-exported class | `Product` / `Outlet` → `undefined` if loaded |
| D2 | open | stub | `FoodProduct`, `Restaurant` | Empty subclasses | Scaffold for food side; seed is grocery-only |
| D3 | open | smell | Product hierarchy | `GroceryProduct` has stock/threshold; unused for health API | Still unused until I7 is done |

---

## API / product lookup

| ID | Status | Type | Location | Issue | Notes |
| ---- | ------ | ---- | -------- | ----- | ----- |
| P1 | partial | smell | [`productService.js`](src/services/productService.js) | Returns `undefined` when not found | `cartService` now guards; other callers may still not |
| P2 | open | smell | Seed products | All products on `store101` only | No inventory for `store102` |
| P3 | open | docs | README sample response | Example shows `product103` / Crackers for an add of `product101` | Sample may be stale/wrong |

---

## How to use this in the interview

1. Don’t dump the whole list — pick 1–2 relevant smells when designing a change.
2. Prefer fixing smells that unblock the story (e.g. null user → clear 404) over drive-by cleanups.
3. When you spot something new, add a row here after the session.

---

## Changelog

| Date | Change |
| ---- | ------ |
| 2026-07-12 | Initial list from README walkthrough + cart/view `user102` investigation |
| 2026-07-14 | Marked S1–S3, S5 fixed; I1/I2/C5 partial-wip; added I5–I7 from inventory work in progress |
| 2026-07-14 | Marked S4 fixed — `createStore` accepts per-store description |
| 2026-07-14 | Marked C1–C2 fixed (cart service guards); C5 notes cart controller still not mapping errors |
| 2026-07-15 | Marked C3 fixed, C4/P1 partial — CartItem + quantity on cart service |
| 2026-07-15 | C4/C5 notes updated — totalPrice + addProduct error mapping; viewCart 404 still open |
| 2026-07-15 | Progress snapshot: cart paused; next = inventory service (I5–I7) + service tests |
