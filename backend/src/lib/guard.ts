class Guard {
  static againstNullOrUndefined(value: unknown, context: string) {
    if (value === null || value === undefined) {
      throw new Error(`Unexpected null or undefined value. context=${context}`);
    }
  }
}

export { Guard };
