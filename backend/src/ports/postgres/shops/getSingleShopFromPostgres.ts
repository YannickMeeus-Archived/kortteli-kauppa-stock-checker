import { parseOneRow } from "../lib/parseShopRow";
import { GetSingleShop, Shop } from "../../../domain/shops";
import { Postgres } from "../postgres";

class GetSingleShopFromPostgres implements GetSingleShop {
  constructor(private readonly postgres: Postgres) {}

  // TODO: Add validation for id string so that I don't hit the db for no reason
  async byId(id: string): Promise<Shop | undefined> {
    const query = `SELECT id, name FROM shops WHERE id=$1`;
    const result = await this.postgres.sql.query(query, [id]);

    if (result.rowCount === 0) {
      // TODO: This is icky
      return undefined;
    }

    return parseOneRow(result.rows);
  }
}

export { GetSingleShopFromPostgres };
