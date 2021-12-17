import { randomUUID } from "crypto";
import { ShopId } from "../shops";
import { CabinetItem } from "./models";
import { Snapshot } from "./models/snapshots/snapshot";

interface StoreSnapshot {
  forShop(id: ShopId, rawInventory: CabinetItem[]): Promise<Snapshot>;
}

class StoreSnapshotInMemory implements StoreSnapshot {
  constructor(private readonly storeInventories: Map<string, Snapshot[]>) {}

  async forShop(id: ShopId, cabinetItems: CabinetItem[]): Promise<Snapshot> {
    const existingSnapshots = this.storeInventories.get(id) || [];
    const newSnapshot = new Snapshot(randomUUID(), id, cabinetItems);
    const toStore = [...existingSnapshots, newSnapshot];
    this.storeInventories.set(id, toStore);
    return newSnapshot;
  }
}
export { StoreSnapshot, StoreSnapshotInMemory };
