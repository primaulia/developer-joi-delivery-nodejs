class CartItem {
  /**
   * @param {Product} product
   * @param {number} quantity
   */
  constructor(product, quantity) {
    this.product = product;
    this.quantity = quantity;
  }
}

module.exports = CartItem;