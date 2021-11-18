import { Guard } from "./guard";

import isNumberCheck from "is-number";
import { ParsingError } from "./parsing/parsingError";
const isNumber = (value: unknown): value is number => {
  return isNumberCheck(value);
};
const asNumber = (value: unknown, context: string): number => {
  Guard.againstNullOrUndefined(value, context);
  if (isNumber(value)) {
    return Number(value);
  }
  throw new ParsingError(isNumber.name, value);
};

export { asNumber };
