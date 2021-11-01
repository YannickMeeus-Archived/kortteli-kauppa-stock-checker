import Request from "supertest";
import { makeHttpApi } from "../../src/http-server/composition-root";

describe("Single Shop Routes", () => {
  describe("GET /shops/:id", () => {
    it("should return a shop by id", async () => {
      const app = makeHttpApi();
      const expectedShop = { name: "Created Shop" };
      const {
        body: {
          data: { id: createdShopId },
        },
      } = await Request(app).post("/shops").send(expectedShop);

      const { body } = await Request(app).get(`/shops/${createdShopId}`);

      expect(body).toBeDefined();
      expect(body.data.id).toEqual(createdShopId);
      expect(body.data.name).toEqual(expectedShop.name);
    });
    it("should return a 404 if the shop can't be found", async () => {
      const app = makeHttpApi();
      const existingShop = { name: "Existing Shop" };
      await Request(app).post("/shops").send(existingShop);

      const { statusCode } = await Request(app).get("/shops/non-existent-id");

      expect(statusCode).toEqual(404);
    });
  });
});
