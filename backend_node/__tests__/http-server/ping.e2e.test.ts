import Request from "supertest";
import { makeFakeHttpApi } from "./makeTestingApi";

describe("Ping Route", () => {
  it("should return a pong", async () => {
    const { statusCode, body } = await Request(makeFakeHttpApi()).get("/_ping");

    expect(statusCode).toEqual(200);
    expect(body).toEqual({ data: "pong" });
  });
});
