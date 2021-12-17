import { ArchiveSnapshot } from "../../../domain/inventory/archiveSnapshot";
import { SnapshotNotFoundError } from "../../../domain/inventory/models/errors/snapshotNotFoundError";
import { SnapshotId } from "../../../domain/inventory/models/snapshots/snapshot";
import { Postgres } from "../postgres";

class ArchiveSnapshotInPostgres implements ArchiveSnapshot {
  constructor(private readonly database: Postgres) {}
  async execute(id: SnapshotId): Promise<void> {
    const query = `UPDATE raw_inventory_data set archived = true where id = $1`;
    const values = [id];
    const result = await this.database.sql.query(query, values);

    if (result.rowCount === 0) {
      throw new SnapshotNotFoundError(id);
    }
  }
}

export { ArchiveSnapshotInPostgres };
