const inventoryService = require("../services/inventoryService");

const inventoryController = {
  fetchStoreInventoryHealth(req, res) {
    const { storeId } = req.query;

    if (!storeId) {
      return res.status(400).json({ message: "Store ID is required" });
    }

    // find the store by storeId
    const store = inventoryService.findStoreById(storeId);
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    const inventoryHealth = inventoryService.fetchStoreInventoryHealth(storeId);
    return res.status(200).json(inventoryHealth);
  },

  findStoreById(storeId) {
    return inventoryService.findStoreById(storeId);
  },
};

module.exports = inventoryController;
