import { getMockReq, getMockRes } from "@jest-mock/express";
import { makeRequireApiKey } from "../../../../src/apps/http-server/middleware/requireApiKey";

describe("makeRequireApiKey Middleware", () => {
  const currentApiKey = "ac8674a6-2e73-4509-801a-84560baf8df2";
  const sut = makeRequireApiKey(currentApiKey);

  const { res, next, mockClear } = getMockRes();
  beforeEach(() => {
    mockClear();
  });
  it("should disallow unauthenticated requests", () => {
    const badRequest = getMockReq();

    sut(badRequest, res, next);
    expect(next).not.toBeCalled();
    expect(res.status).toBeCalledWith(401);
    expect(res.send).toHaveBeenCalledWith("Unauthorized");
  });
  it("should disallow requests with the wrong api token", () => {
    const goodRequest = getMockReq({
      headers: { "x-api-key": `not-the-correct-token` },
    });
    sut(goodRequest, res, next);
    expect(next).not.toBeCalled();
    expect(res.status).toBeCalledWith(401);
    expect(res.send).toHaveBeenCalledWith("Unauthorized");
  });
  it("should allow authenticated requests to go through", () => {
    const goodRequest = getMockReq({
      headers: { "x-api-key": `${currentApiKey}` },
    });
    sut(goodRequest, res, next);
    expect(next).toBeCalled();
  });
});
