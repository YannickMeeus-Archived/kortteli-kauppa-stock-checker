import { WithFlavor } from "@coderspirit/nominal";

export type ShopId = WithFlavor<string, "ShopId">;
export type ShopName = WithFlavor<string, "ShopName">;

export class Shop {
  constructor(public readonly id: ShopId, public readonly name: ShopName) {}
}
