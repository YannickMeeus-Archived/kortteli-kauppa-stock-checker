import { ShopId } from "../shops";
import { Snapshot } from "./models/snapshots/snapshot";

interface GetSnapshot {
  oldestForShop(id: ShopId): Promise<Snapshot | undefined>;
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
}

export { GetSnapshot, GetSnapshotFromMemory };
