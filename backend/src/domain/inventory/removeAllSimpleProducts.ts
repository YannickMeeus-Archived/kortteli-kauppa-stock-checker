import { SimpleProduct } from ".";

interface RemoveAllSimpleProducts {
  forAGivenShop(shopId: string): Promise<void>;
}

class RemoveAllSimpleProductsInMemory implements RemoveAllSimpleProducts {
  constructor(
    private readonly allShopInventories: Map<string, SimpleProduct[]>
  ) {}
  async forAGivenShop(shopId: string): Promise<void> {
    this.allShopInventories.delete(shopId);
  }
}

export { RemoveAllSimpleProducts, RemoveAllSimpleProductsInMemory };
