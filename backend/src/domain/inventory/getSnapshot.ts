import { ShopId } from "../shops";
import { Snapshot } from "./models/snapshots/snapshot";

interface GetSnapshot {
  oldestForShop(id: ShopId): Promise<Snapshot | undefined>;
}

class GetSnapshotFromMemory implements GetSnapshot {
  constructor(private readonly snapShots: Map<string, Snapshot>) {}

  async oldestForShop({ id }: ShopId): Promise<Snapshot | undefined> {
    return this.snapShots.get(id) || undefined;
  }
}

export { GetSnapshot, GetSnapshotFromMemory };
