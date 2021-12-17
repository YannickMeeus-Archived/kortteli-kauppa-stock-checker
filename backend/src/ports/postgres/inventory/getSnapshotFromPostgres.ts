import { GetSnapshot } from "../../../domain/inventory";
import { SnapshotNotFoundError } from "../../../domain/inventory/models/errors/snapshotNotFoundError";
import {
  Snapshot,
  SnapshotId,
} from "../../../domain/inventory/models/snapshots/snapshot";
import { ShopId } from "../../../domain/shops";
import { Postgres } from "../postgres";

class GetSnapshotFromPostgres implements GetSnapshot {
  constructor(private readonly postgres: Postgres) {}

  async oldestForShop(shopId: ShopId): Promise<Snapshot | undefined> {
    const query = `SELECT raw_data FROM raw_inventory_data WHERE shop=$1 ORDER BY created_at ASC LIMIT 1`;
    const result = await this.postgres.sql.query(query, [shopId]);

    if (result.rowCount === 0) {
      return undefined;
    }

    if (result.rowCount > 1) {
      throw new Error(`Multiple rows for shop ${shopId}. Only one expected`);
    }
    const foundRow = result.rows[0];

    return new Snapshot(
      foundRow.id,
      shopId,
      foundRow.raw_data,
      foundRow.created_at,
      foundRow.archived
    );
  }
  async byId(id: SnapshotId): Promise<Snapshot> {
    const query = `SELECT id, raw_data, shop, created_at, archived FROM raw_inventory_data WHERE id=$1`;
    const result = await this.postgres.sql.query(query, [id]);

    if (result.rowCount) {
      const foundRow = result.rows[0];
      return new Snapshot(
        foundRow.id,
        foundRow.shop,
        foundRow.raw_data,
        foundRow.created_at,
        foundRow.archived
      );
    }
    throw new SnapshotNotFoundError(id);
  }
}

export { GetSnapshotFromPostgres };
