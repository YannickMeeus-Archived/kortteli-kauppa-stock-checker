import { GetRawInventory } from "../../../domain/inventory/getRawInventory";
import { CabinetItem } from "../../../domain/inventory/models/raw/cabinetItem";
import { ShopId } from "../../../domain/shops";
import { Postgres } from "../postgres";

class GetRawInventoryFromPostgres implements GetRawInventory {
  constructor(private readonly postgres: Postgres) {}

  async oldestForShop({ id }: ShopId): Promise<CabinetItem[]> {
    const query = `SELECT raw_data FROM raw_inventory_data WHERE shop=$1 ORDER BY created_at ASC LIMIT 1`;
    const result = await this.postgres.sql.query(query, [id]);

    if (result.rowCount === 0) {
      return [];
    }

    if (result.rowCount > 1) {
      throw new Error(`Multiple rows for shop ${id}. Only one expected`);
    }

    return result.rows[0].raw_data;
  }
}

export { GetRawInventoryFromPostgres };
