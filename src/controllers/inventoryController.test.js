const inventoryController = require("./inventoryController");
const inventoryService = require("../services/inventoryService");

jest.mock("../services/inventoryService");

describe("InventoryController", () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    jest.clearAllMocks();

    mockReq = {
      query: {},
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe("fetchStoreInventoryHealth", () => {
    it("shouldReturnTheHealthOfTheStore", () => {
      const storeId = "store101";
      //add required mocking.
      mockReq.query.storeId = storeId;

      const expectedResult = {
        storeId: storeId,
        status: "HEALTHY",
        message: "Store inventory is healthy",
      };

      const expectedStore = {
        name: "Fresh Picks",
        description: "Premium grocery store",
        outletId: storeId,
      };

      const inventoryService = require("../services/inventoryService");
      inventoryService.fetchStoreInventoryHealth.mockReturnValue(expectedResult);
      inventoryService.findStoreById.mockReturnValue(expectedStore);

      inventoryController.fetchStoreInventoryHealth(mockReq, mockRes);

      //put meaning assertions
      expect(inventoryService.fetchStoreInventoryHealth).toHaveBeenCalledWith(storeId);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(expectedResult);
    });

    it("short return an error if storeId is not provided", () => {
      const inventoryService = require("../services/inventoryService");
      inventoryController.fetchStoreInventoryHealth(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Store ID is required" });
      expect(inventoryService.fetchStoreInventoryHealth).not.toHaveBeenCalled();
    });

    it("should return an error if storeId is blank", () => {
      const inventoryService = require("../services/inventoryService");
      mockReq.query.storeId = "";
      inventoryController.fetchStoreInventoryHealth(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Store ID is required" });
      expect(inventoryService.fetchStoreInventoryHealth).not.toHaveBeenCalled();
    });

    it("should return an error if storeId doesn't exist", () => {
       
      const storeId = "store777";

      mockReq.query.storeId = storeId;
      inventoryService.findStoreById.mockReturnValue(null);
      inventoryController.fetchStoreInventoryHealth(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Store not found" });
      expect(inventoryService.findStoreById).toHaveBeenCalledWith(storeId);
      expect(inventoryService.fetchStoreInventoryHealth).not.toHaveBeenCalled();
    });
  });
});
