/* eslint-disable @typescript-eslint/no-empty-function */
import { RequestHandler, Router } from "express";
import { Request } from "express";
import { DeleteShop } from "../../../domain/shops/deleteShop";
import { GetSingleShop } from "../../../domain/shops/getSingleShop";

type HasId = { id: string };
type RequestWithId = Request & HasId;

const hasId = (req: Request): req is RequestWithId => {
  return req.params.id !== undefined;
};

interface UseCases {
  getSingleShop: GetSingleShop;
  deleteShop: DeleteShop;
}
interface ApplicableMiddleware {
  requireApiKey: RequestHandler;
}

const makeSingleShopRouter = (
  { getSingleShop, deleteShop }: UseCases,
  { requireApiKey }: ApplicableMiddleware
): Router => {
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

  singleShopRouter.delete("/", requireApiKey, async (req, res) => {
    if (hasId(req)) {
      const { id } = req.params;
      const shop = await getSingleShop.byId(id);
      if (shop !== undefined) {
        await deleteShop.execute(id);
        return res.sendStatus(204);
      }

      return res.sendStatus(404);
    }
    return res.sendStatus(400);
  });
  return singleShopRouter;
};

export { makeSingleShopRouter };
