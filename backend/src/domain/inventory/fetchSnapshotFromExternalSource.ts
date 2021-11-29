import { Shop } from "../shops";
import { CabinetItem } from "./models/snapshots/cabinetItem";

type Query = Pick<Shop, "id">;

interface FetchSnapshotFromExternalSource {
  forShop(shop: Query): Promise<CabinetItem[]>;
}

class FetchMockedSnapshotFromMemory implements FetchSnapshotFromExternalSource {
  constructor(private readonly storeInventories: Map<string, CabinetItem[]>) {}
  async forShop({ id }: Query): Promise<CabinetItem[]> {
    return this.storeInventories.get(id) || [];
  }
}

export {
  FetchSnapshotFromExternalSource,
  Query,
  FetchMockedSnapshotFromMemory,
};
