import { ShopId } from "../shops";
import { CabinetItem } from "./models/raw/cabinetItem";

interface StoreRawInventory {
  forShop(id: ShopId, rawInventory: CabinetItem[]): Promise<void>;
}

class StoreRawInventoryInMemory implements StoreRawInventory {
  constructor(private readonly storeInventories: Map<string, CabinetItem[]>) {}
  async forShop({ id }: ShopId, rawInventory: CabinetItem[]): Promise<void> {
    this.storeInventories.set(id, rawInventory);
  }
}
export { StoreRawInventory, StoreRawInventoryInMemory };
