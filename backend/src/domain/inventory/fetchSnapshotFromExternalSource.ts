import { ShopId } from "../shops";
import { CabinetItem } from "./models/snapshots/cabinetItem";

interface FetchSnapshotFromExternalSource {
  forShop(id: ShopId): Promise<CabinetItem[]>;
}

class FetchMockedSnapshotFromMemory implements FetchSnapshotFromExternalSource {
  constructor(private readonly storeInventories: Map<string, CabinetItem[]>) {}
  async forShop(id: ShopId): Promise<CabinetItem[]> {
    return this.storeInventories.get(id) || [];
  }
}

export { FetchSnapshotFromExternalSource, FetchMockedSnapshotFromMemory };
