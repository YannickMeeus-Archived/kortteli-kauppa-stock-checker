import { config } from "dotenv";
import { asNumber, asString } from "../src/lib/parsing";
import { Postgres } from "../src/ports/postgres/postgres";
import { GetAllShopsFromPostgres } from "../src/ports/postgres/shops";
import { ImportInventorySnapshots } from "../src/domain/inventory";
import { ArchiveSnapshotInPostgres } from "../src/ports/postgres/inventory/archiveSnapshotInPostgres";
import {
  CreateSimpleProductInPostgres,
  GetSnapshotFromPostgres,
} from "../src/ports/postgres/inventory";

(async () => {
  const devConfig = config({ path: "./.env" });
  if (devConfig.error) {
    throw devConfig.error;
  }

  const development = new Postgres(
    asString(devConfig.parsed?.DATABASE_HOST, "DATABASE_HOST"),
    asNumber(devConfig.parsed?.DATABASE_PORT, "DATABASE_PORT"),
    asString(devConfig.parsed?.DATABASE_NAME, "DATABASE_NAME"),
    asString(devConfig.parsed?.DATABASE_USERNAME, "DATABASE_USERNAME"),
    asString(devConfig.parsed?.DATABASE_PASSWORD, "DATABASE_PASSWORD")
  );

  // Clear out existing products
  await development.sql.query(
    `TRUNCATE TABLE simple_products RESTART IDENTITY CASCADE`
  );
  // Flag all snapshots as unarchived to re-import
  await development.sql.query(`UPDATE raw_inventory_data SET archived = false`);

  const importInventorySnapshots = new ImportInventorySnapshots(
    new GetAllShopsFromPostgres(development),
    new GetSnapshotFromPostgres(development),
    new CreateSimpleProductInPostgres(development),
    new ArchiveSnapshotInPostgres(development)
  );

  await importInventorySnapshots.run();

  process.exit(0);
})();
