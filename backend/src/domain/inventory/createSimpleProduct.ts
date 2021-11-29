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
    epc,
    quantity,
    cabinet,
    shopId,
  }: ProductToCreate): Promise<SimpleProduct> {
    if (!this.allShopInventories.has(shopId)) {
      this.allShopInventories.set(shopId, []);
    }

    const toCreate = new SimpleProduct(
      randomUUID(),
      epc,
      name,
      quantity,
      cabinet,
      shopId
    );
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const inventory = this.allShopInventories.get(shopId)!;
    // All of this is dirty as heck, and needs to be replicated in the postgres
    //  implementation as well. So yeah, not "great"
    const indexOfExistingProduct = inventory.findIndex(
      (product) => product.epc === epc
    );
    if (indexOfExistingProduct >= 0) {
      inventory[indexOfExistingProduct] = toCreate;
    } else {
      inventory.push(toCreate);
    }

    return toCreate;
  }
}

export { CreateSimpleProduct, CreateSimpleProductInMemory };
