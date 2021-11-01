import { Router } from "express";

const infrastructureRouter = Router();

infrastructureRouter.get("/_ping", (req, res) => {
  res.send({ data: "pong" });
});

export { infrastructureRouter };
