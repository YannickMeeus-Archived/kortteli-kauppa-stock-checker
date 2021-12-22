import { ScheduledJob } from "../../../lib/scheduling";
import {
  CreateSimpleProductInPostgres,
  GetSnapshotFromPostgres,
} from "../../../ports/postgres/inventory";
import { Postgres } from "../../../ports/postgres/postgres";
import { ImportInventorySnapshots } from "../../../domain/inventory";
import { ArchiveSnapshotInPostgres } from "../../../ports/postgres/inventory/archiveSnapshotInPostgres";
import { GetAllShopsFromPostgres } from "../../../ports/postgres/shops";
import { RemoveAllSimpleProductsFromPostgres } from "../../../ports/postgres/inventory/removeAllSimpleProductsFromPostgres";

interface ImportSnapshotWorkerConfiguration {
  database: Postgres;
  schedule: string;
}
const makeImportSnapshotWorker = ({
  database,
  schedule,
}: ImportSnapshotWorkerConfiguration): ScheduledJob => {
  const getAllShops = new GetAllShopsFromPostgres(database);

  const getSnapshot = new GetSnapshotFromPostgres(database);
  const removeAllProducts = new RemoveAllSimpleProductsFromPostgres(database);
  const createProduct = new CreateSimpleProductInPostgres(database);
  const archiveSnapshot = new ArchiveSnapshotInPostgres(database);
  const importSnapshots = new ImportInventorySnapshots(
    getAllShops,
    getSnapshot,
    createProduct,
    archiveSnapshot,
    removeAllProducts
  );

  return new ScheduledJob(database, "import-snapshots-worker", schedule, () =>
    importSnapshots.run()
  );
};

export { makeImportSnapshotWorker };
