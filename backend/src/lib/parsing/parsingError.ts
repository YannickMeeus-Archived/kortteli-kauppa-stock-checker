export class ParsingError extends Error {
  constructor(operation: string, triedToParse: unknown) {
    super(`Failed to apply '${operation}' to '${triedToParse}.`);
  }
}
