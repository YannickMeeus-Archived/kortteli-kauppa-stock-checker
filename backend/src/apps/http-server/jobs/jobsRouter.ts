import { RequestHandler, Router } from "express";
import { ImportInventorySnapshots } from "../../../domain/inventory";

interface UseCases {
  importSnapshots: ImportInventorySnapshots;
}
interface ApplicableMiddleware {
  requireApiKey: RequestHandler;
}

const makeJobsRouter = (
  { importSnapshots }: UseCases,
  { requireApiKey }: ApplicableMiddleware
) => {
  const shopsRouter = Router();

  shopsRouter.get("/import-snapshots", requireApiKey, async (req, res) => {
    await importSnapshots.run();
    res.status(200).json({ result: "success" });
  });
  return shopsRouter;
};

export { makeJobsRouter };
