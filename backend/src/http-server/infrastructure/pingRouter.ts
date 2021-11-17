import { RequestHandler, Router } from "express";

interface ApplicableMiddleware {
  requireApiKey: RequestHandler;
}

const makeInfrastructureRouter = ({ requireApiKey }: ApplicableMiddleware) => {
  const infrastructureRouter = Router();
  infrastructureRouter.get("/_ping", (req, res) => {
    res.send({ data: "pong" });
  });
  infrastructureRouter.get("/_secure_ping", requireApiKey, (req, res) => {
    res.send({ data: "secret pong" });
  });

  return infrastructureRouter;
};

export { makeInfrastructureRouter };
