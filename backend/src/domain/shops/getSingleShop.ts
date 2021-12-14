import { Shop, ShopId } from "./models/shop";

export interface GetSingleShop {
  byId(id: ShopId): Promise<Shop | undefined>;
}

export class GetSingleShopFromMemory implements GetSingleShop {
  constructor(private readonly shops: Shop[]) {}

  async byId(id: ShopId): Promise<Shop | undefined> {
    return this.shops.find((shop) => shop.id === id);
  }
}
