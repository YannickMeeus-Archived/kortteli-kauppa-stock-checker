import {
  asNumber,
  ParsingError,
  UnexpectedUndefinedError,
} from "../../src/lib/parsing/";

describe("asNumber", () => {
  it("should return the value if it is a number", () => {
    const parsed = asNumber("1", "test");
    expect(parsed).toBe(1);
  });
  it("should raise a UnexpectedUndefinedError if null or undefined is passed in", () => {
    const invalidValues = [null, undefined];
    invalidValues.forEach((value) => {
      expect(() => {
        asNumber(value, "test");
      }).toThrowError(UnexpectedUndefinedError);
    });
  });
  it.each([["foo"], ["*#&$"], ["46484a9e-f4e8-4055-8ae0-e487824b3ada"]])(
    "should raise a ParsingError up when '%s' is passed in",
    (input) => {
      expect(() => {
        asNumber(input, "test");
      }).toThrowError(ParsingError);
    }
  );
});
