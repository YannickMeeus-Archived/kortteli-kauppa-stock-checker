import { ShopId } from "../shops";
import { ProductToCreate } from "./createSimpleProduct";
import { CabinetItem } from "./models";

export const fromCabinetItemToSimpleProduct =
  ({ id: shopId }: ShopId) =>
  ({
    amount,
    epc,
    location,
    product: { name },
  }: CabinetItem): ProductToCreate => {
    return {
      name: name,
      cabinet: location,
      ean: epc, //TODO: Fix this
      quantity: amount,
      shopId,
    };
  };
