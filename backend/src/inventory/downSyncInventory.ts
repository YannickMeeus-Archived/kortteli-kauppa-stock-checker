import { GetAllShops } from "../shops";
import { PullRawInventory } from "./pullRawInventory";
import { StoreRawInventory } from "./storeRawInventory";

class DownSyncInventory {
  constructor(
    private readonly getAllShops: GetAllShops,
    private readonly pullRawInventory: PullRawInventory,
    private readonly storeRawInventory: StoreRawInventory
  ) {}

  public async run() {
    const allShops = await this.getAllShops.execute();
    for (const shop of allShops) {
      const currentShopsInventory = await this.pullRawInventory.forShop({
        id: shop.id,
      });
      await this.storeRawInventory.forShop(
        { id: shop.id },
        currentShopsInventory
      );
    }
  }
}

export { DownSyncInventory };
