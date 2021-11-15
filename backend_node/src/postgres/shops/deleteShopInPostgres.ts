import { DeleteShop, ShopId } from "../../shops";
import { Postgres } from "../configuration";

class DeleteShopInPostgres implements DeleteShop {
  constructor(private readonly database: Postgres) {}
  async execute({ id }: ShopId): Promise<void> {
    await this.database.sql.query("DELETE FROM shops WHERE id=$1", [id]);
  }
}

export { DeleteShopInPostgres };
