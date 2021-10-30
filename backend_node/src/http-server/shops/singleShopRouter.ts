/* eslint-disable @typescript-eslint/no-empty-function */
import { Router } from "express";

const singleShopRouter = Router();

singleShopRouter.get("/", (req, res) => {
  res.json({ action: "" });
});
singleShopRouter.post("/", (req, res) => {
  res.json({ action: "" });
});
singleShopRouter.put("/", (req, res) => {
  res.json({ action: "" });
});
singleShopRouter.delete("/", (req, res) => {
  res.json({ action: "" });
});

export { singleShopRouter };
