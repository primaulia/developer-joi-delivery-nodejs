## Learned User Preferences

- Preparing for a Thoughtworks live pairing interview on this repo; prefer systematic, time-boxed coaching over dumping a finished solution to memorize.
- Phase-style learning: understand architecture and incomplete spots first with teach-back checks; only then implement with confirm-before-code; debrief so the user can defend every decision.
- Prefer TDD for feature/API behavior; treat seed/wiring bugs and smell notes as exploratory Day-1 work, not mandatory TDD drills.
- Prefer outside-in implementation (HTTP endpoint → controller → service → seed/domain) when building a story.
- Keep living notes of smells/bugs in `CODE_SMELLS.md` and domain relationships in `DOMAIN_MODEL.md`; update those when findings change.
- When a check question is unclear, simplify it; explain the “why” (e.g. why mock the service) before pushing the next step.

## Learned Workspace Facts

- JOI Delivery is a small Node.js/Express in-memory grocery delivery pairing starter (no DB); entry is `src/app.js` on port 8080.
- Architecture is layered API (routes → controllers → services → SeedData/domain), not classic MVC—there is no view layer.
- Working path to mirror: cart controller/service and `cartController.test.js`; likely pairing story is `GET /inventory/health` (stub returning `{}` plus unfinished test).
- Controller unit tests mock `req`/`res` and the service; business rules (e.g. stock vs threshold) belong in service tests, not controller tests.
- Product catalog for a store is `SeedData.groceryProducts` filtered by `product.store`; `GroceryStore.inventory` is an unused empty `Set`.
- Carts are looked up via `cartService.userCarts` Map by `userId`; seeded `User.cart` stays `null` (one-way `cart.user` link only).
- Query/body keys are case-sensitive camelCase (`storeId`, `userId`); prefer aligning docs to code rather than renaming code to match README typos.
- Domain files export the class directly (`module.exports = Class`); `FoodProduct`/`Restaurant` incorrectly use named destructure imports and are unused stubs.
- Run with `npm start` / `npm test` (Jest, colocated `*.test.js`); Node v22 per README.
