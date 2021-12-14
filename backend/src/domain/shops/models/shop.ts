import { WithBrand } from "@coderspirit/nominal";
import { randomUUID } from "crypto";

export const makeShopId = (id: unknown) => id as ShopId;
export const makeNewShopId = () => makeShopId(randomUUID());
export const makeShopName = (name: unknown) => name as ShopName;

export type ShopId = WithBrand<string, "ShopId">;
export type ShopName = WithBrand<string, "ShopName">;
export class Shop {
  constructor(public readonly id: ShopId, public readonly name: ShopName) {}
}
