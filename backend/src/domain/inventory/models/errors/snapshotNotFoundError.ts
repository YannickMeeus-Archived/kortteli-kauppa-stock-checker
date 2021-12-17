class SnapshotNotFoundError extends Error {
  constructor(id: string) {
    super(`Snapshot with id '${id}' not found`);
  }
}
export { SnapshotNotFoundError };
