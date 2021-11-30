import { randomUUID } from "crypto";
import { ShopId } from "../shops";
import { CabinetItem } from "./models";
import { Snapshot } from "./models/snapshots/snapshot";

interface StoreSnapshot {
  forShop(id: ShopId, rawInventory: CabinetItem[]): Promise<void>;
}

class StoreSnapshotInMemory implements StoreSnapshot {
  constructor(private readonly storeInventories: Map<string, Snapshot[]>) {}
  async forShop({ id }: ShopId, rawInventory: CabinetItem[]): Promise<void> {
    this.storeInventories.set(id, [
      ...(this.storeInventories.get(id) || []),
      new Snapshot(randomUUID(), rawInventory, false, new Date()),
    ]);
  }
}
export { StoreSnapshot, StoreSnapshotInMemory };
