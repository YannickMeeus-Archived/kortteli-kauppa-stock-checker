import { Guard } from "./guard";

const isNumber = (value: unknown): value is number => {
  return typeof value === "number";
};
const asNumber = (value: unknown): number => {
  Guard.againstNullOrUndefined(value);
  if (isNumber(value)) {
    return value;
  }
  // TODO: Needs a Parsing Error
  throw new Error(`Failed to parse '${value}' as Number`);
};

export { asNumber };
