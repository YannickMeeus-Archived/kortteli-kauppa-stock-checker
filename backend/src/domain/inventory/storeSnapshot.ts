import { ShopId } from "../shops";
import { CabinetItem } from "./models";

interface StoreSnapshot {
  forShop(id: ShopId, rawInventory: CabinetItem[]): Promise<void>;
}

class StoreSnapshotInMemory implements StoreSnapshot {
  constructor(private readonly storeInventories: Map<string, CabinetItem[]>) {}
  async forShop({ id }: ShopId, rawInventory: CabinetItem[]): Promise<void> {
    this.storeInventories.set(id, rawInventory);
  }
}
export { StoreSnapshot, StoreSnapshotInMemory };
