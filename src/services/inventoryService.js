const inventoryService = {
  fetchStoreInventoryHealth(storeId) {
    return {
      storeId: storeId,
      status: "HEALTHY",
      message: "Store inventory is healthy",
    };
  },
};

module.exports = inventoryService;