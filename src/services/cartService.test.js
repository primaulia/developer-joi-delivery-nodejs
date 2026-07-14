// src/services/cartService.test.js
const cartService = require("./cartService");
const userService = require("./userService");
const productService = require("./productService");

jest.mock("./userService");
jest.mock("./productService"); // keep mocks consistent if other methods pull it in

describe("cartService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    cartService.userCarts.clear();
  });

  describe("getCartForUser", () => {
    it("returns the cart for that user", () => {
      const user = { userId: "user101" };
      const cart = { cartId: "cart101", products: [], user };
      userService.fetchUserById.mockReturnValue(user);
      cartService.userCarts.set("user101", cart);
      const result = cartService.getCartForUser("user101");
      expect(result).toBe(cart);
    });

    it("returns null if the user is not found", () => {
      const user = { userId: "user101" };
      userService.fetchUserById.mockReturnValue(null);
      const result = cartService.getCartForUser("user101");
      expect(result).toBeNull();
    });
  });  

  describe("addProductToCartForUser", () => {
    it("adds a product to the cart for that user", () => {
      const user = { userId: "user101" };
      const cart = { cartId: "cart101", items: [], user };
      const product = { productId: "product101", sellingPrice: 100 };
      productService.getProduct.mockReturnValue(product);
      userService.fetchUserById.mockReturnValue(user);
      cartService.userCarts.set("user101", cart);
      const result = cartService.addProductToCartForUser({
        userId: "user101",
        productId: "product101",
        outletId: "outlet101",
      });
      expect(result).toEqual({
        cart: cart,
        product: product,
        sellingPrice: 100,
      });
    });

    it("throws an error if the product is not found", () => {
      const user = { userId: "user101" };
      const cart = { cartId: "cart101", items: [], user };
      const product = { productId: "product101", sellingPrice: 100 };
      productService.getProduct.mockReturnValue(null);
      userService.fetchUserById.mockReturnValue(user);
      cartService.userCarts.set("user101", cart);
      expect(() => cartService.addProductToCartForUser({
        userId: "user101",
        productId: "product101",
        outletId: "outlet101",
      })).toThrow("Product not found");
    });

    it("throws an error if the user is not found", () => {
      const user = { userId: "user101" };
      const cart = { cartId: "cart101", items: [], user };
      const product = { productId: "product101", sellingPrice: 100 };
      productService.getProduct.mockReturnValue(product);
      userService.fetchUserById.mockReturnValue(null);
      cartService.userCarts.set("user101", cart);
      expect(() => cartService.addProductToCartForUser({
        userId: "user101",
        productId: "product101",
        outletId: "outlet101",
      })).toThrow("User not found");
    });

    it("stores the product details and quantity in the cart", () => {
      const user = { userId: "user101" };
      const cart = { cartId: "cart101", items: [], user };
      const product = { productId: "product101", sellingPrice: 100 };
      productService.getProduct.mockReturnValue(product);
      userService.fetchUserById.mockReturnValue(user);
      cartService.userCarts.set("user101", cart);
      const result = cartService.addProductToCartForUser({
        userId: "user101",
        productId: "product101",
        outletId: "outlet101",
        quantity: 2,
      });
      expect(result).toEqual({
        cart: cart,
        product: product,
        sellingPrice: 100,
      });
      expect(cart.items).toHaveLength(1);
      expect(cart.items[0].quantity).toBe(2);
      expect(cart.items[0].product.productId).toBe("product101");
      expect(cart.items[0].product.sellingPrice).toBe(100);
    });

    it("add 1 product to the cart if the quantity is not provided", () => {
      const user = { userId: "user101" };
      const cart = { cartId: "cart101", items: [], user };
      const product = { productId: "product101", sellingPrice: 100 };
      productService.getProduct.mockReturnValue(product);
      userService.fetchUserById.mockReturnValue(user);
      cartService.userCarts.set("user101", cart);
      const result = cartService.addProductToCartForUser({
        userId: "user101",
        productId: "product101",
        outletId: "outlet101",
      });
      expect(result).toEqual({
        cart: cart,
        product: product,
        sellingPrice: 100,
      });
      expect(cart.items).toHaveLength(1);
      expect(cart.items[0].quantity).toBe(1);
      expect(cart.items[0].product.productId).toBe("product101");
      expect(cart.items[0].product.sellingPrice).toBe(100);
    });

    it("throws an error if the quantity is not a number", () => {
      const user = { userId: "user101" };
      const cart = { cartId: "cart101", items: [], user };
      const product = { productId: "product101", sellingPrice: 100, quantity: 'not a number' };
      productService.getProduct.mockReturnValue(product);
      userService.fetchUserById.mockReturnValue(user);
      cartService.userCarts.set("user101", cart);
      expect(() => cartService.addProductToCartForUser({
        userId: "user101",
        productId: "product101",
        outletId: "outlet101",
        quantity: 'not a number',
      })).toThrow("Quantity must be a number");
    });

    it("throws an error if the quantity is less than 1", () => {
      const user = { userId: "user101" };
      const cart = { cartId: "cart101", items: [], user };
      const product = { productId: "product101", sellingPrice: 100 };
      productService.getProduct.mockReturnValue(product);
      userService.fetchUserById.mockReturnValue(user);
      cartService.userCarts.set("user101", cart);
      expect(() => cartService.addProductToCartForUser({
        userId: "user101",
        productId: "product101",
        outletId: "outlet101",
        quantity: 0,
      })).toThrow("Quantity must be greater than 0");
    });

    it("calculates the total price of the cart", () => {
      const user = { userId: "user101" };
      const cart = { cartId: "cart101", items: [], user, totalPrice: 0 };
      const product = { productId: "product101", sellingPrice: 100 };
      productService.getProduct.mockReturnValue(product);
      userService.fetchUserById.mockReturnValue(user);
      cartService.userCarts.set("user101", cart);
      const result = cartService.addProductToCartForUser({
        userId: "user101",
        productId: "product101",
        outletId: "outlet101",
        quantity: 2,
      });
      expect(result).toEqual({
        cart: cart,
        product: product,
        sellingPrice: 100,
      });
      expect(cart.totalPrice).toBe(200);
    });
  });
});