import { Guard } from "../../src/lib/guard";

describe("Guard", () => {
  it("should throw if the value passed in is null", () => {
    expect(() =>
      Guard.againstNullOrUndefined(null, "test field")
    ).toThrowError();
  });
  it("should throw if the value passed in is undefined", () => {
    expect(() =>
      Guard.againstNullOrUndefined(undefined, "test field")
    ).toThrowError();
  });
  it("should not throw if a non-undefined/null value is passed in", () => {
    expect(() =>
      Guard.againstNullOrUndefined("test", "test field")
    ).not.toThrowError();
  });
});
