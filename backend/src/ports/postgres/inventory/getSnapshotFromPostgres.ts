import { GetSnapshot } from "../../../domain/inventory";
import { Snapshot } from "../../../domain/inventory/models/snapshots/snapshot";
import { ShopId } from "../../../domain/shops";
import { Postgres } from "../postgres";

class GetSnapshotFromPostgres implements GetSnapshot {
  constructor(private readonly postgres: Postgres) {}

  async oldestForShop(id: ShopId): Promise<Snapshot | undefined> {
    const query = `SELECT raw_data FROM raw_inventory_data WHERE shop=$1 ORDER BY created_at ASC LIMIT 1`;
    const result = await this.postgres.sql.query(query, [id]);

    if (result.rowCount === 0) {
      return undefined;
    }

    if (result.rowCount > 1) {
      throw new Error(`Multiple rows for shop ${id}. Only one expected`);
    }
    const foundRow = result.rows[0];

    // TODO: Add migration to create processed column
    const snapshot = new Snapshot(foundRow.id, foundRow.raw_data, false);
    return snapshot;
  }
}

export { GetSnapshotFromPostgres };
