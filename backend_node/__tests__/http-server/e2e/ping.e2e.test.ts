import Request from "supertest";
import {
  makeFakeHttpApi,
  makeTestingDatabase,
  testingApiKey,
  TestingDatabase,
} from "./makeTestingApi";

describe("Ping Route", () => {
  let testingDatabase: TestingDatabase;

  beforeAll(async () => {
    testingDatabase = await makeTestingDatabase();
  });

  afterAll(async () => {
    await testingDatabase.stop();
  });

  it("should return a pong", async () => {
    const { statusCode, body } = await Request(
      makeFakeHttpApi(testingDatabase.database)
    ).get("/_ping");

    expect(statusCode).toEqual(200);
    expect(body).toEqual({ data: "pong" });
  });
});

describe("Secure Ping Route", () => {
  let testingDatabase: TestingDatabase;
  beforeAll(async () => {
    testingDatabase = await makeTestingDatabase();
  });

  afterAll(async () => {
    await testingDatabase.stop();
  });
  it("When the correct api key is provided, it should respond with a secret pong", async () => {
    const { statusCode, body } = await Request(
      makeFakeHttpApi(testingDatabase.database)
    )
      .get("/_secure_ping")
      .set("x-api-key", testingApiKey);
    expect(statusCode).toEqual(200);
    expect(body).toEqual({ data: "secret pong" });
  });
  it("When no key is provided, it should disallow access", async () => {
    const { statusCode } = await Request(
      makeFakeHttpApi(testingDatabase.database)
    ).get("/_secure_ping");
    expect(statusCode).toEqual(401);
  });
});
