const cartController = require("./cartController");

jest.mock("../services/cartService");

describe("CartController", () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    jest.clearAllMocks();

    mockReq = {
      body: {},
      query: {},
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe("addProductToCart", () => {
    it("shouldAddTheRequestedProductToTheCart", () => {
      const addProductRequest = {
        userId: "user101",
        productId: "grocery101",
        outletId: "store101",
        quantity: 2,
      };

      mockReq.body = addProductRequest;

      const expectedResult = {
        cart: { products: [] },
        product: { productId: "grocery101", name: "Organic Bananas" },
        sellingPrice: 3.49,
      };

      const cartService = require("../services/cartService");
      cartService.addProductToCartForUser.mockReturnValue(expectedResult);

      cartController.addProductToCart(mockReq, mockRes);

      expect(cartService.addProductToCartForUser).toHaveBeenCalledWith(
        addProductRequest
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(expectedResult);
    });

    it("should return a 400 error if the quantity is not a number", () => {
      const addProductRequest = {
        userId: "user101",
        productId: "grocery101",
        outletId: "store101",
        quantity: "not a number",
      };
      mockReq.body = addProductRequest;
      const cartService = require("../services/cartService");
      cartService.addProductToCartForUser.mockImplementation(() => {
        const error = new Error("Quantity must be a number");
        error.status = 400;
        throw error;
      });
      cartController.addProductToCart(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Quantity must be a number" });  
    });

    it("should return a 400 error if the quantity is less than 1", () => {
      const addProductRequest = {
        userId: "user101",
        productId: "grocery101",
        outletId: "store101",
        quantity: 0,
      };
      mockReq.body = addProductRequest;
      const cartService = require("../services/cartService");
      cartService.addProductToCartForUser.mockImplementation(() => {
        const error = new Error("Quantity must be greater than 0");
        error.status = 400;
        throw error;
      });
      cartController.addProductToCart(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Quantity must be greater than 0" });
    });
  });

  describe("viewCart", () => {
    it("shouldReturnTheCart", () => {
      const userId = "user101";
      mockReq.query = { userId };

      const expectedCart = {
        cartId: "cart101",
        userId: "user101",
        products: [
          { productId: "grocery101", name: "Organic Bananas", quantity: 2 },
        ],
        total: 6.98,
      };

      const cartService = require("../services/cartService");
      cartService.getCartForUser.mockReturnValue(expectedCart);

      cartController.viewCart(mockReq, mockRes);

      expect(cartService.getCartForUser).toHaveBeenCalledWith(userId);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(expectedCart);
    });
  });
});
