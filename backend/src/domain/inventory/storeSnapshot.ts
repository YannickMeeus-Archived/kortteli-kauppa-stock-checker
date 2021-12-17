import { randomUUID } from "crypto";
import { ShopId } from "../shops";
import { CabinetItem } from "./models";
import { Snapshot, SnapshotId } from "./models/snapshots/snapshot";

interface StoreSnapshot {
  forShop(id: ShopId, rawInventory: CabinetItem[]): Promise<Snapshot>;
}

class StoreSnapshotInMemory implements StoreSnapshot {
  constructor(private readonly snapshots: Map<SnapshotId, Snapshot>) {}

  async forShop(id: ShopId, cabinetItems: CabinetItem[]): Promise<Snapshot> {
    const newSnapshot = new Snapshot(randomUUID(), id, cabinetItems);
    this.snapshots.set(newSnapshot.id, newSnapshot);
    return newSnapshot;
  }
}
export { StoreSnapshot, StoreSnapshotInMemory };
