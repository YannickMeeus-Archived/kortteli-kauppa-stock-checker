class Guard {
  static againstNullOrUndefined(value: unknown) {
    if (value === null || value === undefined) {
      throw new Error("Unexpected null or undefined value");
    }
  }
}

export { Guard };
