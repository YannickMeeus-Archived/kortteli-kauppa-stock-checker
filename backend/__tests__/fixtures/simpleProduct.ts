import { ProductToCreate } from "../../src/domain/inventory/createSimpleProduct";
import { ShopId } from "../../src/domain/shops";

export const makeProductToCreateFor = (
  forShop: ShopId,
  patch?: Partial<ProductToCreate>
): ProductToCreate => {
  const template = {
    cabinet: "Cabinet 1",
    epc: "12345678901",
    name: "Product 1",
    quantity: 10,
    shopId: forShop.id,
  };
  return { ...template, ...patch };
};
