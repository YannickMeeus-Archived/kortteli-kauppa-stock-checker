import { ShopId } from "../shops";
import { SnapshotNotFoundError } from "./models/errors/snapshotNotFoundError";
import { Snapshot, SnapshotId } from "./models/snapshots/snapshot";

interface GetSnapshot {
  oldestForShop(id: ShopId): Promise<Snapshot | undefined>;
  byId(id: SnapshotId): Promise<Snapshot>;
}

class GetSnapshotFromMemory implements GetSnapshot {
  constructor(private readonly snapShots: Map<string, Snapshot[]>) {}

  async oldestForShop(id: ShopId): Promise<Snapshot | undefined> {
    const allSnapshots = this.snapShots.get(id);
    if (!allSnapshots) {
      return undefined;
    }
    // return oldest snapshot
    return allSnapshots
      .filter((s) => !s.archived)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())[0];
  }
  async byId(id: SnapshotId): Promise<Snapshot> {
    const found = [...this.snapShots.values()].flat().find((s) => s.id === id);
    if (!found) {
      throw new SnapshotNotFoundError(id);
    }
    return found;
  }
}

export { GetSnapshot, GetSnapshotFromMemory };
