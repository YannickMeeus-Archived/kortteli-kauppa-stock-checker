import { ShopId } from "../shops";
import { Snapshot } from "./models/snapshots/snapshot";

interface GetRawInventory {
  oldestForShop(id: ShopId): Promise<Snapshot | undefined>;
}

class GetRawInventoryFromMemory implements GetRawInventory {
  constructor(private readonly snapShots: Map<string, Snapshot>) {}

  async oldestForShop({ id }: ShopId): Promise<Snapshot | undefined> {
    return this.snapShots.get(id) || undefined;
  }
}

export { GetRawInventory, GetRawInventoryFromMemory };
