import Request from "supertest";
import { makeFakeHttpApi, testingApiKey } from "./makeTestingApi";

describe("Single Shop Routes", () => {
  describe("GET /shops/:id", () => {
    it("should return a shop by id", async () => {
      const app = makeFakeHttpApi();
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
      const app = makeFakeHttpApi();

      const existingShop = { name: "Existing Shop" };
      await Request(app).post("/shops").send(existingShop);

      const { statusCode } = await Request(app).get("/shops/non-existent-id");

      expect(statusCode).toEqual(404);
    });
  });
  describe("DELETE /shops/:id", () => {
    it("should delete a shop", async () => {
      const app = makeFakeHttpApi();

      const expectedShop = { name: "Created Shop" };
      const {
        body: {
          data: { id: createdShopId },
        },
      } = await Request(app).post("/shops").send(expectedShop);
      const { statusCode } = await Request(app)
        .delete(`/shops/${createdShopId}`)
        .set("x-api-key", testingApiKey);

      expect(statusCode).toEqual(204);
      const existingShops = await Request(app).get("/shops");
      expect(existingShops.body.data).toHaveLength(0);
    });
    it("should return a 404 if the shop can't be found", async () => {
      const app = makeFakeHttpApi();

      const existingShop = { name: "Existing Shop" };
      await Request(app).post("/shops").send(existingShop);

      const { statusCode } = await Request(app)
        .delete("/shops/non-existent-id")
        .set("x-api-key", testingApiKey);

      expect(statusCode).toEqual(404);
    });
    it("should reject calls without an x-api-key header", async () => {
      const app = makeFakeHttpApi();

      const existingShop = { name: "Existing Shop" };
      await Request(app).post("/shops").send(existingShop);

      const { statusCode } = await Request(app).delete(
        "/shops/non-existent-id"
      );

      expect(statusCode).toEqual(401);
    });
    it("should reject calls with an invalid x-api-key header", async () => {
      const app = makeFakeHttpApi();

      const existingShop = { name: "Existing Shop" };
      await Request(app).post("/shops").send(existingShop);

      const { statusCode } = await Request(app)
        .delete("/shops/non-existent-id")
        .set("x-api-key", "foo");

      expect(statusCode).toEqual(401);
    });
  });
});
