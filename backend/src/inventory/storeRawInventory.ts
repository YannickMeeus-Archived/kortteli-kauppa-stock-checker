import { ShopId } from "../shops";
import { CabinetItem } from "./models/cabinetItem";

interface StoreRawInventory {
  forShop(id: ShopId, rawInventory: CabinetItem[]): Promise<void>;
}

class StoreRawInventoryInMemory implements StoreRawInventory {
  constructor(private readonly storeInventories: Map<string, CabinetItem[]>) {}
  async forShop({ id }: ShopId, rawInventory: CabinetItem[]): Promise<void> {
    console.log(
      `Storing ${rawInventory.length} items for shop with id '${id}'`
    );
    this.storeInventories.set(id, rawInventory);
  }
}
export { StoreRawInventory, StoreRawInventoryInMemory };
