import { UnexpectedUndefinedError } from "./parsing/unexpectedUndefinedError";

class Guard {
  static againstNullOrUndefined(value: unknown, context: unknown) {
    if (value === null || value === undefined) {
      throw new UnexpectedUndefinedError(context);
    }
  }
}

export { Guard };
