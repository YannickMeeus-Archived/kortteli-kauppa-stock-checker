/* eslint-disable @typescript-eslint/no-empty-function */
import { Router } from "express";
import { Request } from "express";
import { GetSingleShop } from "./getSingleShop";
const singleShopRouter = Router();

type HasId = { id: string };
type RequestWithId = Request & HasId;

const hasId = (req: Request): req is RequestWithId => {
  return req.params.id !== undefined;
};

interface useCases {
  getSingleShop: GetSingleShop;
}
const makeSingleShopRouter = ({ getSingleShop }: useCases): Router => {
  const singleShopRouter = Router({ mergeParams: true });

  singleShopRouter.get("/", async (req, res) => {
    if (hasId(req)) {
      const { id } = req.params;
      const shop = await getSingleShop.byId(id);
      if (shop !== undefined) {
        return res.status(200).json({ data: shop });
      }
      return res.sendStatus(404);
    }
    return res.sendStatus(400);
  });
  return singleShopRouter;
};

singleShopRouter.post("/", (req, res) => {
  res.json({ action: "" });
});
singleShopRouter.put("/", (req, res) => {
  res.json({ action: "" });
});
singleShopRouter.delete("/", (req, res) => {
  res.json({ action: "" });
});

export { singleShopRouter, makeSingleShopRouter };
