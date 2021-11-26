import { Shop } from "../shops";
import { CabinetItem } from "./models/snapshots/cabinetItem";

type Query = Pick<Shop, "id">;

interface PullRawInventory {
  forShop(shop: Query): Promise<CabinetItem[]>;
}

class PullRawInventoryFromMemory implements PullRawInventory {
  constructor(private readonly storeInventories: Map<string, CabinetItem[]>) {}
  async forShop({ id }: Query): Promise<CabinetItem[]> {
    return this.storeInventories.get(id) || [];
  }
}

export { PullRawInventory, Query, PullRawInventoryFromMemory };
