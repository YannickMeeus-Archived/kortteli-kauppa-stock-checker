import { Postgres } from "./postgres/postgres";
import { path as root } from "app-root-path";
// eslint-disable-next-line @typescript-eslint/no-var-requires
import { config } from "dotenv";

import { randomUUID } from "crypto";
import listEndpoints from "express-list-endpoints";
import { makeHttpApi } from "./http-server/composition-root";
import { Migrations } from "./postgres/migrations";
import { asString } from "./lib/asString";
import { asNumber } from "./lib/asNumber";

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

    httpApi.listen(serverPort, () => {
      console.log(listEndpoints(httpApi));
      console.log(`Server is listening on port ${serverPort}`);
    });
  } catch (e) {
    console.error(e);
    throw e;
  }
})();