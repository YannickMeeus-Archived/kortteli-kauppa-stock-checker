import { Router } from "express";
import { CreateNewShop } from "./createNewShop";
import { GetAllShops } from "./getShops";

interface UseCases {
  getAllShops: GetAllShops;
  createNewShop: CreateNewShop;
}

const makeShopsRouter = ({ getAllShops, createNewShop }: UseCases) => {
  const shopsRouter = Router();

  shopsRouter.get("/", async (req, res) => {
    const allShops = await getAllShops.execute();
    res.status(200).json({ data: allShops });
  });

  shopsRouter.post("/", async (req, res) => {
    const { name } = req.body;
    const createdShop = await createNewShop.execute({ name });
    res.status(201).json({ data: createdShop });
  });

  return shopsRouter;
};

export { makeShopsRouter };
