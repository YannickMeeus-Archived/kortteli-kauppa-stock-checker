import Request from "supertest";
import { makeFakeHttpApi, testingApiKey } from "./makeTestingApi";

describe("Ping Route", () => {
  it("should return a pong", async () => {
    const { statusCode, body } = await Request(makeFakeHttpApi()).get("/_ping");

    expect(statusCode).toEqual(200);
    expect(body).toEqual({ data: "pong" });
  });
});

describe("Secure Ping Route", () => {
  it("When the correct api key is provided, it should respond with a secret pong", async () => {
    const { statusCode, body } = await Request(makeFakeHttpApi())
      .get("/_secure_ping")
      .set("x-api-key", testingApiKey);
    expect(statusCode).toEqual(200);
    expect(body).toEqual({ data: "secret pong" });
  });
  it("When no key is provided, it should disallow access", async () => {
    const { statusCode } = await Request(makeFakeHttpApi()).get(
      "/_secure_ping"
    );
    expect(statusCode).toEqual(401);
  });
});
