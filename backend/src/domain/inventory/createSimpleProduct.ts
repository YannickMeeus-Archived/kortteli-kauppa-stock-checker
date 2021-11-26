import { randomUUID } from "crypto";
import { SimpleProduct } from "./models/simpleProduct";

export type ProductToCreate = Omit<SimpleProduct, "id">;
interface CreateSimpleProduct {
  execute(productToCreate: ProductToCreate): Promise<SimpleProduct>;
}

class CreateSimpleProductInMemory implements CreateSimpleProduct {
  constructor(
    private readonly allShopInventories: Map<string, SimpleProduct[]>
  ) {}
  async execute({
    name,
    ean,
    quantity,
    cabinet,
    shopId,
  }: ProductToCreate): Promise<SimpleProduct> {
    if (!this.allShopInventories.has(shopId)) {
      this.allShopInventories.set(shopId, []);
    }

    const toCreate = new SimpleProduct(
      randomUUID(),
      ean,
      name,
      quantity,
      cabinet,
      shopId
    );
    this.allShopInventories.get(shopId)?.push(toCreate);
    return toCreate;
  }
}

export { CreateSimpleProduct, CreateSimpleProductInMemory };
