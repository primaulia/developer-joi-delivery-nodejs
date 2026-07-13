const SeedData = require("../seedData/seedData");

const inventoryService = {
  fetchStoreInventoryHealth(storeId) {
    return {
      storeId: storeId,
      status: "HEALTHY",
      message: "Store inventory is healthy",
    };
  },

  findStoreById(storeId) {
    return SeedData.stores.find(store => store.storeId === storeId);
  },
};

module.exports = inventoryService;