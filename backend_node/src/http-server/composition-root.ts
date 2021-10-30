import { json } from "body-parser";
import express from "express";

import { infrastructureRouter } from "./infrastructure/router";
import { CreateNewShopInMemory } from "./shops/createNewShop";
import { GetAllShopsFromMemory } from "./shops/getShops";
import { Shop } from "./shops/models/shop";
import { makeShopsRouter } from "./shops/shopsRouter";
import { singleShopRouter } from "./shops/singleShopRouter";

const makeHttpApi = () => {
  const shops: Shop[] = [];

  const getShops = new GetAllShopsFromMemory(shops);
  const createNewShop = new CreateNewShopInMemory(shops);
  const httpApi = express();
  httpApi.use(json());
  httpApi.use("/", infrastructureRouter);
  httpApi.use(
    "/shops/",
    makeShopsRouter({ getAllShops: getShops, createNewShop: createNewShop })
  );
  httpApi.use("/shop/:id", singleShopRouter);

  return httpApi;
};

export { makeHttpApi };
