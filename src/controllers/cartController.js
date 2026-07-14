const cartService = require("../services/cartService");

const cartController = {
  addProductToCart(req, res) {
    try {
      const result = cartService.addProductToCartForUser(req.body);
      res.status(200).json(result);
    } catch (error) {
      res.status(error.status).json({ message: error.message });
    }
  },

  viewCart(req, res) {
    const cart = cartService.getCartForUser(req.query.userId);
    res.status(200).json(cart);
  },
};

module.exports = cartController;
