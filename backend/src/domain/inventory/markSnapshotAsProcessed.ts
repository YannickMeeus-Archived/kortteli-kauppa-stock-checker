interface MarkSnapshotAsProcessed {
  execute(snapshotId: string): Promise<void>;
}

export { MarkSnapshotAsProcessed };
