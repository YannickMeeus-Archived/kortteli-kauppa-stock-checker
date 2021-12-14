import { makeNewShopId, Shop } from "./models/shop";

export type CreatableShop = Omit<Shop, "id">;

export interface CreateNewShop {
  execute(shop: CreatableShop): Promise<Shop>;
}

export class CreateNewShopInMemory implements CreateNewShop {
  constructor(private readonly shops: Shop[]) {}

  async execute({ name }: CreatableShop): Promise<Shop> {
    const newId = makeNewShopId();
    const newShop = new Shop(newId, name);
    this.shops.push(newShop);
    return newShop;
  }
}
