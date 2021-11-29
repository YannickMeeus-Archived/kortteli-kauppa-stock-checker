import { ShopId } from "../../../domain/shops";
import { Postgres } from "../postgres";
import { CabinetItem, StoreSnapshot } from "../../../domain/inventory";

class StoreSnapshotInPostgres implements StoreSnapshot {
  constructor(private readonly postgres: Postgres) {}
  async forShop({ id }: ShopId, rawInventory: CabinetItem[]): Promise<void> {
    await this.postgres.sql.query(
      `INSERT INTO raw_inventory_data (shop, raw_data) values ($1, $2)`,
      [id, JSON.stringify(rawInventory)]
    );
  }
}

export { StoreSnapshotInPostgres };
