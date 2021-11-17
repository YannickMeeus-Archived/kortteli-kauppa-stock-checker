import { Guard } from "../../src/lib/guard";

describe("Guard", () => {
  it("should throw if the value passed in is null", () => {
    expect(() => Guard.againstNullOrUndefined(null)).toThrowError();
  });
  it.todo("should throw if the value passed in is undefined");
  it.todo("should not throw if a non-undefined/null value is passed in");
});
