import { SimpleProduct } from ".";

interface RemoveAllSimpleProduct {
  forAGivenShop(shopId: string): Promise<void>;
}

class RemoveAllSimpleProductInMemory implements RemoveAllSimpleProduct {
  constructor(
    private readonly allShopInventories: Map<string, SimpleProduct[]>
  ) {}
  async forAGivenShop(shopId: string): Promise<void> {
    this.allShopInventories.delete(shopId);
  }
}

export { RemoveAllSimpleProduct, RemoveAllSimpleProductInMemory };
