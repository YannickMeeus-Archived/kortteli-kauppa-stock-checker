import { SnapshotNotFoundError } from "./models/errors/snapshotNotFoundError";
import { Snapshot } from "./models/snapshots/snapshot";

interface ArchiveSnapshot {
  execute(id: string): Promise<Snapshot>;
}

class ArchiveSnapshotInMemory implements ArchiveSnapshot {
  constructor(private readonly snapShots: Map<string, Snapshot>) {}

  async execute(id: string): Promise<Snapshot> {
    const foundSnapshot = this.snapShots.get(id);
    if (!foundSnapshot) {
      throw new SnapshotNotFoundError(id);
    }

    this.snapShots.set(id, { ...foundSnapshot, archived: true });

    return foundSnapshot;
  }
}

export { ArchiveSnapshot, ArchiveSnapshotInMemory };
