import { json } from "body-parser";
import express from "express";

import { Shop } from "../shops/models/shop";

import { makeInfrastructureRouter } from "./infrastructure/pingRouter";
import { MakeRequireApiKey } from "./middleware/requireApiKey";
import { makeShopsRouter } from "./shops/shopsRouter";
import { makeSingleShopRouter } from "./shops/singleShopRouter";
import { Postgres } from "../postgres/configuration";
import { DeleteShopFromMemory } from "../shops";
import {
  CreateNewShopInPostgres,
  GetSingleShopFromPostgres,
} from "../postgres/shops";
import { GetAllShopsFromPostgres } from "../postgres/shops/getAllShopsFromPostgres";

interface SecurityConfiguration {
  apiKey: string;
}
interface HttpConfiguration {
  security: SecurityConfiguration;
  database: Postgres;
}
const makeHttpApi = ({ security, database: database }: HttpConfiguration) => {
  const { apiKey } = security;
  const shops: Shop[] = [];

  const getAllShops = new GetAllShopsFromPostgres(database);
  const createNewShop = new CreateNewShopInPostgres(database);
  const getSingleShop = new GetSingleShopFromPostgres(database);
  const deleteShop = new DeleteShopFromMemory(shops);

  const requireApiKey = MakeRequireApiKey(apiKey);

  const httpApi = express();
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
