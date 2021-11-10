import {Postgres} from "./postgres/configuration";

const loadConfiguration = require('dotenv').config();

if (loadConfiguration.error) {
  throw loadConfiguration.error
}

// TODO: Remove this once live
console.log('---- DEV MODE ----')
console.log('---- Configuration Loaded ----')
console.log(loadConfiguration.parsed);
console.log('------------------------------')

import {randomUUID} from "crypto";
import listEndpoints from "express-list-endpoints";
import {makeHttpApi} from "./http-server/composition-root";

const serverPort = process.env.PORT || 3000;
const apiKey = process.env.API_KEY || randomUUID();

// TODO: Implement safe configuration parser
const postgres = new Postgres(
  process.env.DATABASE_HOST!,
  process.env.DATABASE_PORT!,
  process.env.DATABASE_NAME!,
  process.env.DATABASE_USERNAME!,
  process.env.DATABASE_PASSWORD!,
)// TODO: Fix this up so that it blows up when it's not set

console.log('---- Postgres URL ----')
console.log(postgres.getUrl())
const httpApi = makeHttpApi(
  {
    security: {apiKey},
    database: postgres
  }
);

httpApi.listen(serverPort, () => {
  console.log(listEndpoints(httpApi));
  console.log(`Server is listening on port ${serverPort}`);
});
