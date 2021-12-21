// So apparently fly.io has an issue when smashing their internal DNS server to pulp...
//  In order to sidestep absolutely breaking their *free* service I am taking advantage of..
//  I'll be monkey-patching node's dns module by wrapping a cache around it.
//  That's right... I am adding a naive cache around DNS, what could possibly go wrong?

// Everything

// Everything could go wrong

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dnscache")({
  enable: true,
  ttl: 30, // This should be enough... I just need to resolve the supabase IP once
  cachesize: 10, // Just in case there's more mcguffings that'll be cached.
});
// Don't judge me, I don't want to pay for this, alright?
import CronTime from "cron-time-generator";
import { path as root } from "app-root-path";
import { config } from "dotenv";
import { randomUUID } from "crypto";
import listEndpoints from "express-list-endpoints";

import { Postgres } from "./ports/postgres/postgres";
import { makeHttpApi } from "./apps/http-server/composition-root";
import { Migrations } from "./ports/postgres/migrations";
import { asNumber, asString } from "./lib/parsing";
import { makeRetrieveInventoryWorker } from "./apps/workers/retrieve-inventory-worker/composition-root";
import { makeImportSnapshotWorker } from "./apps/workers/import-snapshots-worker/composition-root";

(async () => {
  try {
    if (process.env.NODE_ENV !== "production") {
      const configurationLoadingResult = config();
      if (configurationLoadingResult.error) {
        throw configurationLoadingResult.error;
      }
      console.log("---- DEV MODE ----");
      console.log("---- Configuration Loaded ----");
      console.log(configurationLoadingResult.parsed);
      console.log("------------------------------");
    }

    const serverPort = process.env.PORT || 3000;
    const apiKey = process.env.API_KEY || randomUUID();

    const postgres = new Postgres(
      asString(process.env.DATABASE_HOST, "DATABASE_HOST"),
      asNumber(process.env.DATABASE_PORT, "DATABASE_PORT"),
      asString(process.env.DATABASE_NAME, "DATABASE_NAME"),
      asString(process.env.DATABASE_USERNAME, "DATABASE_USERNAME"),
      asString(process.env.DATABASE_PASSWORD, "DATABASE_PASSWORD")
    );

    console.log("---- Postgres URL ----");
    if (process.env.NODE_ENV !== "production") {
      console.log(postgres.getConnectionString());
    }

    console.log("---- Migrations ----");
    const migrations = new Migrations(postgres, root);
    await migrations.execute();
    const httpApi = makeHttpApi({
      security: { apiKey },
      database: postgres,
    });

    console.log("---- Workers ----");

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const retrieveInventoryWorker = makeRetrieveInventoryWorker({
      database: postgres,
      kortteliKauppaBaseUrl: "http://188.166.11.123",
      schedule: CronTime.every(30).minutes(),
    });

    const importSnapshotWorker = makeImportSnapshotWorker({
      database: postgres,
      schedule: CronTime.every(1).minutes(),
    });

    await retrieveInventoryWorker.start();
    await importSnapshotWorker.start();

    httpApi.listen(serverPort, () => {
      console.log(listEndpoints(httpApi));
      console.log(`Server is listening on port ${serverPort}`);
    });
  } catch (e) {
    console.error(e);
    throw e;
  }
})();
