import { json } from "body-parser";
import express from "express";

import { makeInfrastructureRouter } from "./infrastructure/pingRouter";
import { makeRequireApiKey } from "./middleware/requireApiKey";
import { makeShopsRouter } from "./shops/shopsRouter";
import { makeSingleShopRouter } from "./shops/singleShopRouter";
import { Postgres } from "../../ports/postgres/postgres";
import {
  CreateNewShopInPostgres,
  GetSingleShopFromPostgres,
} from "../../ports/postgres/shops";
import { GetAllShopsFromPostgres } from "../../ports/postgres/shops/getAllShopsFromPostgres";
import { DeleteShopInPostgres } from "../../ports/postgres/shops/deleteShopInPostgres";
import cors from "cors";
import { makeJobsRouter } from "./jobs/jobsRouter";
import { ImportInventorySnapshots } from "../../domain/inventory";
import {
  CreateSimpleProductInPostgres,
  GetSnapshotFromPostgres,
} from "../../ports/postgres/inventory";
import { ArchiveSnapshotInPostgres } from "../../ports/postgres/inventory/archiveSnapshotInPostgres";

interface SecurityConfiguration {
  apiKey: string;
}
interface HttpConfiguration {
  security: SecurityConfiguration;
  database: Postgres;
}
const makeHttpApi = ({ security, database: database }: HttpConfiguration) => {
  const { apiKey } = security;

  const getAllShops = new GetAllShopsFromPostgres(database);
  const createNewShop = new CreateNewShopInPostgres(database);
  const getSingleShop = new GetSingleShopFromPostgres(database);
  const deleteShop = new DeleteShopInPostgres(database);

  const getSnapshot = new GetSnapshotFromPostgres(database);
  const createProduct = new CreateSimpleProductInPostgres(database);
  const archiveSnapshot = new ArchiveSnapshotInPostgres(database);
  const importSnapshots = new ImportInventorySnapshots(
    getAllShops,
    getSnapshot,
    createProduct,
    archiveSnapshot
  );
  const requireApiKey = makeRequireApiKey(apiKey);

  const httpApi = express();
  httpApi.use(cors());
  httpApi.use(json());
  httpApi.use("/", makeInfrastructureRouter({ requireApiKey }));
  httpApi.use(
    "/shops/",
    makeShopsRouter({ getAllShops, createNewShop }, { requireApiKey })
  );
  httpApi.use(
    "/shops/:id",
    makeSingleShopRouter({ getSingleShop, deleteShop }, { requireApiKey })
  );
  httpApi.use("/jobs/", makeJobsRouter({ importSnapshots }, { requireApiKey }));

  return httpApi;
};

export { makeHttpApi };
