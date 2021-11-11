/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Postgres } from "./postgres/configuration";

// eslint-disable-next-line @typescript-eslint/no-var-requires
import { config } from "dotenv";

const configurationLoadingResult = config();
if (configurationLoadingResult.error) {
  throw configurationLoadingResult.error;
}
import { randomUUID } from "crypto";
import listEndpoints from "express-list-endpoints";
import { makeHttpApi } from "./http-server/composition-root";
import { Migrations } from "./postgres/migrations";
import { asString } from "./lib/asString";

(async () => {
  // TODO: Remove this once live
  console.log("---- DEV MODE ----");
  console.log("---- Configuration Loaded ----");
  console.log(configurationLoadingResult.parsed);
  console.log("------------------------------");

  const serverPort = process.env.PORT || 3000;
  const apiKey = process.env.API_KEY || randomUUID();

  // TODO: Implement safe configuration parser
  const postgres = new Postgres(
    asString(process.env.DATABASE_HOST),
    asString(process.env.DATABASE_PORT),
    asString(process.env.DATABASE_NAME),
    asString(process.env.DATABASE_USERNAME),
    asString(process.env.DATABASE_PASSWORD)
  ); // TODO: Fix this up so that it blows up when it's not set

  console.log("---- Postgres URL ----");
  console.log(postgres.getUrl());

  console.log("---- Migrations ----");
  const migrations = new Migrations(postgres, process.env.PWD!);
  await migrations.execute();
  const httpApi = makeHttpApi({
    security: { apiKey },
    database: postgres,
  });

  httpApi.listen(serverPort, () => {
    console.log(listEndpoints(httpApi));
    console.log(`Server is listening on port ${serverPort}`);
  });
})();
