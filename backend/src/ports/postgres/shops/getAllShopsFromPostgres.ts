import { GetAllShops, Shop } from "../../../domain/shops";
import { Postgres } from "../postgres";
import { fromDbShopRow } from "../lib";

class GetAllShopsFromPostgres implements GetAllShops {
  constructor(private readonly database: Postgres) {}
  async execute(): Promise<Shop[]> {
    const results = await this.database.sql.query("SELECT id, name FROM SHOPS");

    return results.rows.map(fromDbShopRow);
  }
}

export { GetAllShopsFromPostgres };
