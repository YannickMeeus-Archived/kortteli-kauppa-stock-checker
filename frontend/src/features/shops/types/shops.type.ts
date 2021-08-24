import { ShopIdentifier } from "./shop-identifier.type";

export interface Shop {
  id: ShopIdentifier;
  name: string;
}
export type Shops = Shop[];
