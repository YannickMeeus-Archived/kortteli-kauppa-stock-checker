import got from "got";
import { CabinetItem } from "../../domain/inventory/models";
import { PullRawInventory, Query } from "../../domain/inventory";
import { GetSingleShop } from "../../domain/shops";
import { ShopNotFoundError } from "../../domain/shops/errors/ShopNotFoundError";

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
    ).json<CabinetItem[]>();

    return results;
  }
}

export { PullRawInventoryFromExternalApi };
