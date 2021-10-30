import Request from "supertest";
import { makeHttpApi } from "../../src/http-server/composition-root";

describe("Shop Routes", () => {
  describe("GET /shops", () => {
    it("should return all created shops", async () => {
      const app = makeHttpApi();

      // Create a few shops
      await Request(app).post("/shops").send({ name: "Shop 1" });
      await Request(app).post("/shops").send({ name: "Shop 2" });

      const response = await Request(app).get("/shops");

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(2);
    });
  });
});
