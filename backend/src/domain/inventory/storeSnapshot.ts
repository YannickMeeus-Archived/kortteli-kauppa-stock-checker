import { randomUUID } from "crypto";
import { ShopId } from "../shops";
import { CabinetItem } from "./models";
import { Snapshot } from "./models/snapshots/snapshot";

interface StoreSnapshot {
  forShop(id: ShopId, rawInventory: CabinetItem[]): Promise<void>;
}

class StoreSnapshotInMemory implements StoreSnapshot {
  constructor(private readonly storeInventories: Map<string, Snapshot[]>) {}

  async forShop(id: ShopId, cabinetItems: CabinetItem[]): Promise<void> {
    const existingSnapshots = this.storeInventories.get(id) || [];
    const toStore = [
      ...existingSnapshots,
      new Snapshot(randomUUID(), cabinetItems),
    ];
    this.storeInventories.set(id, toStore);
  }
}
export { StoreSnapshot, StoreSnapshotInMemory };
