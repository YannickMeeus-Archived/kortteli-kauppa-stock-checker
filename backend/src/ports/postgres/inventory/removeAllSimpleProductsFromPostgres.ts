import { RemoveAllSimpleProducts } from "../../../domain/inventory";
import { Postgres } from "../postgres";

class RemoveAllSimpleProductsFromPostgres implements RemoveAllSimpleProducts {
  constructor(private readonly database: Postgres) {}
  async forAGivenShop(shopId: string): Promise<void> {}
}

export { RemoveAllSimpleProductsFromPostgres };
