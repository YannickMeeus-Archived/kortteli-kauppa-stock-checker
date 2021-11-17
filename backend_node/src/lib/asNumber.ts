import { Guard } from "./guard";

import isNumberCheck from "is-number";
const isNumber = (value: unknown): value is number => {
  return isNumberCheck(value);
};
const asNumber = (value: unknown): number => {
  Guard.againstNullOrUndefined(value);
  if (isNumber(value)) {
    return Number(value);
  }
  // TODO: Needs a Parsing Error
  throw new Error(`Failed to parse '${value}' as Number`);
};

export { asNumber };
