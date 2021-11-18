export class UnexpectedUndefinedError extends Error {
  constructor(context: unknown) {
    super(
      `Unexpected null or undefined value for value with name '${context}'`
    );
  }
}
