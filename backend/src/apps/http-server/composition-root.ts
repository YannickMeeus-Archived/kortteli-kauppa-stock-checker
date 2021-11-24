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

  const requireApiKey = makeRequireApiKey(apiKey);

  const httpApi = express();
  httpApi.use(cors());
  httpApi.use(json());
  httpApi.use("/", makeInfrastructureRouter({ requireApiKey }));
  httpApi.use("/shops/", makeShopsRouter({ getAllShops, createNewShop }));
  httpApi.use(
    "/shops/:id",
    makeSingleShopRouter({ getSingleShop, deleteShop }, { requireApiKey })
  );

  return httpApi;
};

export { makeHttpApi };
