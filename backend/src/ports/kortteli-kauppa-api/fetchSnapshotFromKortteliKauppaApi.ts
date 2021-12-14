import got from "got";

import { CabinetItem } from "../../domain/inventory";
import { FetchSnapshotFromExternalSource } from "../../domain/inventory";
import { GetSingleShop, ShopId } from "../../domain/shops";
import { ShopNotFoundError } from "../../domain/shops";

class FetchSnapshotFromKortteliKauppaApi
  implements FetchSnapshotFromExternalSource
{
  constructor(
    private readonly baseUrl: string,
    private readonly getSingleShop: GetSingleShop
  ) {}
  async forShop(id: ShopId): Promise<CabinetItem[]> {
    const shop = await this.getSingleShop.byId(id);
    if (!shop) {
      throw new ShopNotFoundError(id);
    }

    const results = await got(
      `${this.baseUrl}/Kortteliapp/api/cabin/list/v2/${shop.name}`
    ).json<CabinetItem[]>();

    return results;
  }
}

export { FetchSnapshotFromKortteliKauppaApi };
