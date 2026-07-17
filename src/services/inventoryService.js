const SeedData = require("../seedData/seedData");

const inventoryService = {
  fetchStoreInventoryHealth(storeId) {

    const store = this.findStoreById(storeId);
    if (!store) {
      throw new Error("Store not found");
    }

    const inventoryHealth = this.calculateInventoryHealth(store);
    return {
      storeId: store.outletId,
      products: inventoryHealth,
    };
  },

  findStoreById(storeId) {
    return SeedData.stores.find(store => store.outletId === storeId);
  },

  calculateInventoryHealth(store) {
    return Array.from(store.inventory.values()).map(product => ({
      productId: product.productId,
      productName: product.productName,
      availableStock: product.availableStock,
      threshold: product.threshold,
      status: product.isEmptyStock() ? 'EMPTY' : product.isLowStock() ? 'LOW' : 'HEALTHY',
    }));
  }
};

module.exports = inventoryService;