class Cart {
  /**
   * @param {string} cartId
   * @param {Outlet} outlet
   * @param {User} user
   * @param {number} totalPrice
   * @param {Array<CartItem>} items
   */
  constructor(cartId, outlet, user) {
    /** @type {string} */
    this.cartId = cartId;

    /** @type {Outlet} */
    this.outlet = outlet;

    /** @type {Array<CartItem>} */
    this.items = [];

    /** @type {User} */
    this.user = user;

    /** @type {number} */
    this.totalPrice = 0;
  }
}

module.exports = Cart;
