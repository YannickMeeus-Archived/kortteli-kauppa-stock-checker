import { json } from "body-parser";
import express from "express";
import { CreateNewShopInMemory } from "../shops/createNewShop";
import { DeleteShopFromMemory } from "../shops/deleteShop";
import { GetAllShopsFromMemory } from "../shops/getShops";
import { GetSingleShopFromMemory } from "../shops/getSingleShop";
import { Shop } from "../shops/models/shop";
import { makeInfrastructureRouter } from "./infrastructure/pingRouter";
import { MakeRequireApiKey } from "./middleware/requireApiKey";
import { makeShopsRouter } from "./shops/shopsRouter";
import { makeSingleShopRouter } from "./shops/singleShopRouter";
import {Postgres} from "../postgres/configuration";

interface SecurityConfiguration {
  apiKey: string;
}
interface HttpConfiguration {
  security: SecurityConfiguration,
  database: Postgres
}
const makeHttpApi = ({ security, database }: HttpConfiguration) => {
  const {apiKey} = security
  const shops: Shop[] = [];

  const getAllShops = new GetAllShopsFromMemory(shops);
  const createNewShop = new CreateNewShopInMemory(shops);
  const getSingleShop = new GetSingleShopFromMemory(shops);
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
