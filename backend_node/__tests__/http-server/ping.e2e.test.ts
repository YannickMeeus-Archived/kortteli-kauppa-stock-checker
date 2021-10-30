import Request from "supertest";
import { makeHttpApi } from "../../src/http-server/composition-root";

describe("Ping Route", () => {
  it("should return a pong", async () => {
    const { statusCode, body } = await Request(makeHttpApi()).get("/_ping");

    expect(statusCode).toEqual(200);
    expect(body).toEqual({ data: "pong" });
  });
});
