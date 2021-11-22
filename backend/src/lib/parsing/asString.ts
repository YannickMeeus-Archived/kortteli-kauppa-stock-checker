import { Guard } from "../guard";
import { ParsingError } from "./parsingError";

const isString = (value: unknown): value is string => {
  return typeof value === "string";
};
const asString = (value: unknown, context: unknown): string => {
  Guard.againstNullOrUndefined(value, context);
  if (isString(value)) {
    return value;
  }
  throw new ParsingError(asString.name, value);
};

export { asString };
