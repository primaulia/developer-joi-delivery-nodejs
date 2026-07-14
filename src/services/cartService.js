const userService = require("./userService");
const productService = require("./productService");

const CartItem = require("../domain/cartItem");

const cartService = {
  userCarts: new Map(),

  addProductToCartForUser(addProductRequest) {
    const user = userService.fetchUserById(addProductRequest.userId);
    if (!user) {
      const error = new Error("User not found");
      error.status = 400;
      throw error;
    }

    const cart = this.fetchCartForUser(user);
    if (!cart) {
      const error = new Error("Cart not found");
      error.status = 400;
      throw error;
    }
    const product = productService.getProduct(
      addProductRequest.productId,
      addProductRequest.outletId
    );
    if (!product) {
      const error = new Error("Product not found");
      error.status = 400;
      throw error;
    }

    if (addProductRequest.quantity !== undefined && typeof addProductRequest.quantity !== "number") {
      const error = new Error("Quantity must be a number");
      error.status = 400;
      throw error;
    }
    if (addProductRequest.quantity < 1) {
      const error = new Error("Quantity must be greater than 0");
      error.status = 400;
      throw error;
    }

    cart.items.push(new CartItem(product, addProductRequest.quantity ?? 1));
    cart.totalPrice += product.sellingPrice * (addProductRequest.quantity ?? 1);
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
