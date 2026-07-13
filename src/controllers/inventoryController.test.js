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

      inventoryService.fetchStoreInventoryHealth.mockReturnValue(expectedResult);


      inventoryController.fetchStoreInventoryHealth(mockReq, mockRes);

      //put meaning assertions
      expect(inventoryService.fetchStoreInventoryHealth).toHaveBeenCalledWith(storeId);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(expectedResult);
    });
  });
});
