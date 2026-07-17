const inventoryService = require("./inventoryService");

describe("inventoryService", () => {
  describe("findStoreById", () => {
    it("finds a store by outletId", () => {
      const store = inventoryService.findStoreById("store101");
      expect(store.outletId).toBe("store101");
      expect(store.name).toBe("Fresh Picks");
    });


    it("returns undefined when store does not exist", () => {
      expect(inventoryService.findStoreById("store999")).toBeUndefined();
    });
  });

  describe("fetchStoreInventoryHealth", () => {
    it("returns per-product health for a store with healthy stock", () => {
      const result = inventoryService.fetchStoreInventoryHealth("store101");

      expect(result.storeId).toBe("store101");
      expect(result.products).toEqual([
        {
          productId: "product101",
          productName: "Wheat Bread",
          availableStock: 30,
          threshold: 10,
          status: "HEALTHY",
        },
        {
          productId: "product102",
          productName: "Spinach",
          availableStock: 30,
          threshold: 10,
          status: "HEALTHY",
        },
        {
          productId: "product103",
          productName: "Crackers",
          availableStock: 30,
          threshold: 10,
          status: "HEALTHY",
        },
      ]);
    });

    it("returns mixed HEALTHY, LOW, and EMPTY statuses", () => {
        const store = inventoryService.findStoreById("store101");
        const byId = Object.fromEntries(
          [...store.inventory].map((p) => [p.productId, p])
        );
      
        const originals = {
          product102: byId.product102.availableStock,
          product103: byId.product103.availableStock,
        };
      
        byId.product102.availableStock = 5;  // LOW (< threshold 10)
        byId.product103.availableStock = 0;  // EMPTY
      
        try {
          const result = inventoryService.fetchStoreInventoryHealth("store101");
      
          expect(result.products).toEqual(
            expect.arrayContaining([
              expect.objectContaining({ productId: "product101", status: "HEALTHY" }),
              expect.objectContaining({
                productId: "product102",
                availableStock: 5,
                status: "LOW",
              }),
              expect.objectContaining({
                productId: "product103",
                availableStock: 0,
                status: "EMPTY",
              }),
            ])
          );
          expect(result.products).toHaveLength(3);
        } finally {
          byId.product102.availableStock = originals.product102;
          byId.product103.availableStock = originals.product103;
        }
      });

  });
});