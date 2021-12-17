import { SnapshotNotFoundError } from "./models/errors/snapshotNotFoundError";
import { Snapshot, SnapshotId } from "./models/snapshots/snapshot";

interface ArchiveSnapshot {
  execute(id: SnapshotId): Promise<void>;
}

class ArchiveSnapshotInMemory implements ArchiveSnapshot {
  constructor(private readonly snapShots: Map<string, Snapshot>) {}

  async execute(id: SnapshotId): Promise<void> {
    const foundSnapshot = this.snapShots.get(id);
    if (!foundSnapshot) {
      throw new SnapshotNotFoundError(id);
    }

    this.snapShots.set(id, { ...foundSnapshot, archived: true });
  }
}

export { ArchiveSnapshot, ArchiveSnapshotInMemory };
