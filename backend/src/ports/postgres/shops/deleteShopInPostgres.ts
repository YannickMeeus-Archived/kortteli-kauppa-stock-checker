import { DeleteShop, ShopId } from "../../../domain/shops";
import { Postgres } from "../postgres";

class DeleteShopInPostgres implements DeleteShop {
  constructor(private readonly database: Postgres) {}

  async execute({ id }: ShopId): Promise<void> {
    await this.database.sql.query("DELETE FROM shops WHERE id=$1", [id]);
  }
}

export { DeleteShopInPostgres };
