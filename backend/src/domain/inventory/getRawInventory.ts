import { ShopId } from "../shops";
import { CabinetItem } from "./models/raw/cabinetItem";

interface GetRawInventory {
  oldestForShop(id: ShopId): Promise<CabinetItem[]>;
}

class GetRawInventoryFromMemory implements GetRawInventory {
  constructor(private readonly storeInventories: Map<string, CabinetItem[]>) {}

  async oldestForShop({ id }: ShopId): Promise<CabinetItem[]> {
    return this.storeInventories.get(id) || [];
  }
}

export { GetRawInventory, GetRawInventoryFromMemory };
