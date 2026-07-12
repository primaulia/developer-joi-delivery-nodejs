# JOI Delivery — Domain / entity relationships

Simple map of how objects relate in code today (after seed + add-to-cart).

## Inheritance

```mermaid
classDiagram
  Outlet <|-- GroceryStore
  Outlet <|-- Restaurant
  Product <|-- GroceryProduct
  Product <|-- FoodProduct

  class Outlet {
    name
    description
    outletId
  }
  class GroceryStore {
    inventory Set
  }
  class Restaurant
  class Product {
    productId
    productName
    mrp
  }
  class GroceryProduct {
    sellingPrice
    weight
    expiryDate
    threshold
    availableStock
    store
    discount
  }
  class FoodProduct
```

`Restaurant` / `FoodProduct` are empty stubs (broken named imports — see `CODE_SMELLS.md`).

## Runtime associations (what your e2e uses)

```mermaid
erDiagram
  User ||--o| Cart : "cart.user points to User"
  Cart }o--|| Outlet : "cart.outlet (seeded store101)"
  Cart ||--o{ Product : "cart.products[]"
  GroceryProduct }o--|| GroceryStore : "product.store"

  User {
    string userId
    string username
    string firstName
    string lastName
    string email
    string phoneNumber
    cart null
  }

  Cart {
    string cartId
    outlet Outlet
    products Product_array
    user User
  }

  GroceryStore {
    string outletId
    string name
    inventory empty_Set
  }

  GroceryProduct {
    string productId
    number threshold
    number availableStock
    store GroceryStore
  }
```

## How data is held (important asymmetry)

```mermaid
flowchart TB
  subgraph seed [SeedData]
    users["users[]"]
    carts["cartForUsers Map userId to Cart"]
    products["groceryProducts[]"]
    stores["store101 / store102"]
  end

  subgraph runtime [cartService at startup]
    userCarts["userCarts Map copied from cartForUsers"]
  end

  carts --> userCarts
  users -.->|"lookup by userId"| userCarts
  products -->|"pushed into cart.products on POST /cart/product"| userCarts
  stores -->|"cart.outlet and product.store"| carts
```

| Link | Wired today? |
|------|----------------|
| `Cart.user` → `User` | Yes (after seed fix) |
| `User.cart` → `Cart` | No — always `null` in seed |
| `Cart.outlet` → store | Yes — both carts use `store101` |
| `GroceryProduct.store` → store | Yes |
| `GroceryStore.inventory` → products | No — Set stays empty; catalog is `SeedData.groceryProducts` |
| User → Cart for HTTP | Via `cartService.userCarts.get(userId)`, not `user.cart` |

## Seed IDs (cheat sheet)

| Entity | IDs |
|--------|-----|
| Users | `user101` John, `user102` Rachel |
| Stores | `store101` Fresh Picks, `store102` Natural Choice |
| Products | `product101–103` on `store101` only |
| Carts | `cart101` / `cart102` keyed by userId in the Map |
