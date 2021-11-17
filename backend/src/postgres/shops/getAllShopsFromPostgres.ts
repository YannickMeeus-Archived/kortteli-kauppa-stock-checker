import { dbShop } from "./models/dbShop";
import { GetAllShops, Shop } from "../../shops";
import { Postgres } from "../postgres";

class GetAllShopsFromPostgres implements GetAllShops {
  constructor(private readonly database: Postgres) {}
  async execute(): Promise<Shop[]> {
    const results = await this.database.sql.query("SELECT id, name FROM SHOPS");

    return this.fromRows(results.rows);
  }
  private fromRows(rows: dbShop[]): Shop[] {
    return rows.map((row) => {
      return {
        id: row.id,
        name: row.name,
      };
    });
  }
}

export { GetAllShopsFromPostgres };
