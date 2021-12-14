import { GetSimpleProducts } from "../../../domain/inventory/getSimpleProduct";
import { SimpleProduct } from "../../../domain/inventory/models/simpleProduct";
import { ShopId } from "../../../domain/shops";
import { Postgres } from "../postgres";

class GetSimpleProductFromPostgres implements GetSimpleProducts {
  constructor(private readonly postgres: Postgres) {}

  async forShop(id: ShopId): Promise<SimpleProduct[]> {
    const foundShops = await this.postgres.sql.query(
      `
    SELECT
        id
      , epc
      , quantity
      , shop_id
      , cabinet
      , name
    FROM
        simple_products
    WHERE
        shop_id = $1;

    `,
      [id]
    );

    if (foundShops.rowCount === 0) {
      return [];
    }
    return foundShops.rows.map(
      (row): SimpleProduct => ({
        id: row.id,
        epc: row.epc,
        quantity: row.quantity,
        shopId: row.shop_id,
        name: row.name,
        cabinet: row.cabinet,
      })
    );
  }
}

export { GetSimpleProductFromPostgres };
