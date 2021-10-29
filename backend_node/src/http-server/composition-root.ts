import express from "express";
import { infrastructureRouter } from "./infrastructure";

const makeHttpApi = () => {
  const httpApi = express();

  httpApi.use(infrastructureRouter);

  return httpApi;
};

export { makeHttpApi };
