import { ShopId } from "../../../domain/shops";
import { Postgres } from "../postgres";
import { CabinetItem, StoreSnapshot } from "../../../domain/inventory";
import { Snapshot } from "../../../domain/inventory/models/snapshots/snapshot";

class StoreSnapshotInPostgres implements StoreSnapshot {
  constructor(private readonly postgres: Postgres) {}
  async forShop(id: ShopId, rawInventory: CabinetItem[]): Promise<Snapshot> {
    const createdRow = await this.postgres.sql.query(
      `INSERT INTO raw_inventory_data (shop, raw_data) values ($1, $2) RETURNING id, shop, raw_data, created_at, archived`,
      [id, JSON.stringify(rawInventory)]
    );

    const created = createdRow.rows[0];
    return new Snapshot(
      created.id,
      created.shop,
      created.raw_data,
      created.created_at,
      created.archived
    );
  }
}

export { StoreSnapshotInPostgres };
