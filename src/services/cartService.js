const userService = require("./userService");
const productService = require("./productService");

const cartService = {
  userCarts: new Map(),

  addProductToCartForUser(addProductRequest) {
    const user = userService.fetchUserById(addProductRequest.userId);
    if (!user) {
      throw new Error("User not found");
    }

    const cart = this.fetchCartForUser(user);
    if (!cart) {
      throw new Error("Cart not found");
    }
    const product = productService.getProduct(
      addProductRequest.productId,
      addProductRequest.outletId
    );
    
    if (!product) {
      throw new Error("Product not found");
    }
    cart.products.push(product);
    return {
      cart: cart,
      product: product,
      sellingPrice: product.sellingPrice,
    };
  },

  getCartForUser(userId) {  
    const user = userService.fetchUserById(userId);
    if (!user) {
      return null;
    }
    return this.fetchCartForUser(user);
  },

  fetchCartForUser(user) {
    return this.userCarts.get(user.userId) ?? null;
  },
};

module.exports = cartService;
