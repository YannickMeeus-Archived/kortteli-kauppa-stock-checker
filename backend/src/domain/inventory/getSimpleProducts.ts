import { ShopId } from "../shops";
import { SimpleProduct } from "./models/simpleProduct";

interface GetSimpleProducts {
  forShop(id: ShopId): Promise<SimpleProduct[]>;
}

class GetSimpleProductsFromMemory implements GetSimpleProducts {
  constructor(
    private readonly allShopInventories: Map<string, SimpleProduct[]>
  ) {}

  async forShop(id: ShopId): Promise<SimpleProduct[]> {
    return this.allShopInventories.get(id) || [];
  }
}

export { GetSimpleProducts, GetSimpleProductsFromMemory };
