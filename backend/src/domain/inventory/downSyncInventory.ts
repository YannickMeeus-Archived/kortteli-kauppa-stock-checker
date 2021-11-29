import { GetAllShops } from "../shops";
import { FetchSnapshotFromExternalSource } from "./fetchSnapshotFromExternalSource";
import { StoreSnapshot } from "./storeSnapshot";

class DownSyncInventory {
  constructor(
    private readonly getAllShops: GetAllShops,
    private readonly fetchSnapshot: FetchSnapshotFromExternalSource,
    private readonly storeSnapshot: StoreSnapshot
  ) {}

  public async run() {
    const allShops = await this.getAllShops.execute();
    for (const shop of allShops) {
      const currentShopsInventory = await this.fetchSnapshot.forShop({
        id: shop.id,
      });
      await this.storeSnapshot.forShop({ id: shop.id }, currentShopsInventory);
    }
  }
}

export { DownSyncInventory };
