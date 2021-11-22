import got from "got";
import { CabinetItem } from "../inventory/models/cabinetItem";
import { PullRawInventory, Query } from "../inventory/pullRawInventory";
import { GetSingleShop } from "../shops";
import { ShopNotFoundError } from "../shops/errors/ShopNotFoundError";

class PullRawInventoryFromExternalApi implements PullRawInventory {
  constructor(
    private readonly baseUrl: string,
    private readonly getSingleShop: GetSingleShop
  ) {}
  async forShop(_shop: Query): Promise<CabinetItem[]> {
    const shop = await this.getSingleShop.byId(_shop.id);
    if (!shop) {
      throw new ShopNotFoundError(_shop.id);
    }

    const results = await got(
      `${this.baseUrl}/Kortteliapp/api/cabin/list/v2/${shop.name}`
    ).json();
    return results as CabinetItem[];
  }
}

export { PullRawInventoryFromExternalApi };
