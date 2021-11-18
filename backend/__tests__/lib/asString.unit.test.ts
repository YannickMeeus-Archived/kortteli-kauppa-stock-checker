import { asString } from "../../src/lib/asString";
import { ParsingError } from "../../src/lib/parsing/parsingError";
import { UnexpectedUndefinedError } from "../../src/lib/parsing/unexpectedUndefinedError";

describe("asString", () => {
  it("should return the value if it is a number", () => {
    const parsed = asString("a string", "test");
    expect(parsed).toBe("a string");
  });
  it("should raise a UnexpectedUndefinedError if null or undefined is passed in", () => {
    const invalidValues = [null, undefined];
    invalidValues.forEach((value) => {
      expect(() => {
        asString(value, "test");
      }).toThrowError(UnexpectedUndefinedError);
    });
  });
  it.each([[0], [true], [0.0]])(
    "should raise a ParsingError up when '%s' is passed in",
    (input) => {
      expect(() => {
        asString(input, "test");
      }).toThrowError(ParsingError);
    }
  );
});
