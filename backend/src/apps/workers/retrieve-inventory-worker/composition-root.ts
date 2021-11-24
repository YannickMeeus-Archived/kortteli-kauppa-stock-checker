import { DownSyncInventory } from "../../../domain/inventory";
import { PullRawInventoryFromExternalApi } from "../../../ports/kortteli-kauppa-api";
import { ScheduledJob } from "../../../lib/scheduling";
import { StoreRawInventoryInPostgres } from "../../../ports/postgres/inventory";
import { Postgres } from "../../../ports/postgres/postgres";
import {
  GetAllShopsFromPostgres,
  GetSingleShopFromPostgres,
} from "../../../ports/postgres/shops";

interface RetrieveInventoryWorkerConfiguration {
  database: Postgres;
  schedule: string;
  kortteliKauppaBaseUrl: string;
}
const makeRetrieveInventoryWorker = ({
  database,
  schedule,
  kortteliKauppaBaseUrl,
}: RetrieveInventoryWorkerConfiguration): ScheduledJob => {
  const getAllShops = new GetAllShopsFromPostgres(database);
  const getSingleShop = new GetSingleShopFromPostgres(database);
  const pullRawInventory = new PullRawInventoryFromExternalApi(
    kortteliKauppaBaseUrl,
    getSingleShop
  );
  const storeRawInventory = new StoreRawInventoryInPostgres(database);

  const synchronizeInventory = new DownSyncInventory(
    getAllShops,
    pullRawInventory,
    storeRawInventory
  );

  const scheduledJob = new ScheduledJob(
    database,
    "retrieve-inventory-worker",
    schedule,
    (_) => synchronizeInventory.run()
  );
  return scheduledJob;
};

export { makeRetrieveInventoryWorker };
