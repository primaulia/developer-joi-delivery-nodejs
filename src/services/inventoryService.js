const SeedData = require("../seedData/seedData");
const cartService = require("./cartService");

const inventoryService = {
  fetchStoreInventoryHealth(storeId) {

    const store = this.findStoreById(storeId);
    if (!store) {
      throw new Error("Store not found");
    }

    const inventoryHealth = cartService.calculateInventoryHealth(store);
    return inventoryHealth;
  },

  findStoreById(storeId) {
    return SeedData.stores.find(store => store.storeId === storeId);
  },
};

module.exports = inventoryService;