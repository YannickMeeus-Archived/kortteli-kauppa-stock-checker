import { RemoveAllSimpleProducts } from "../../../domain/inventory";
import { Postgres } from "../postgres";

class RemoveAllSimpleProductsFromPostgres implements RemoveAllSimpleProducts {
  constructor(private readonly database: Postgres) {}
  async forAGivenShop(shopId: string): Promise<void> {
    const query = `DELETE FROM simple_products where shop_id = $1`;
    await this.database.sql.query(query, [shopId]);
  }
}

export { RemoveAllSimpleProductsFromPostgres };
