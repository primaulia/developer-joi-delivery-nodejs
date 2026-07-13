const inventoryService = require("../services/inventoryService");

const inventoryController = {
  fetchStoreInventoryHealth(req, res) {
    const { storeId } = req.query;
    const inventoryHealth = inventoryService.fetchStoreInventoryHealth(storeId);
    return res.status(200).json(inventoryHealth);
  },
};

module.exports = inventoryController;
