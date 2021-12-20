import { ShopId } from "../shops";
import { SnapshotNotFoundError } from "./models/errors/snapshotNotFoundError";
import { Snapshot, SnapshotId } from "./models/snapshots/snapshot";

interface GetSnapshot {
  oldestUnArchivedForShop(id: ShopId): Promise<Snapshot | undefined>;
  byId(id: SnapshotId): Promise<Snapshot>;
}
class GetSnapshotFromMemory implements GetSnapshot {
  constructor(private readonly snapShots: Map<SnapshotId, Snapshot>) {}

  async oldestUnArchivedForShop(shopId: ShopId): Promise<Snapshot | undefined> {
    const allSnapshots = [...this.snapShots.values()];
    return allSnapshots
      .filter((s) => !s.archived && s.shop === shopId)
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
