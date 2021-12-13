import { RequestHandler, Router } from "express";
import { short } from "git-rev-sync";

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
  infrastructureRouter.get("/_version", (req, res) => {
    const version = process.env.VERSION || short();
    res.send({ data: { version } });
  });

  return infrastructureRouter;
};

export { makeInfrastructureRouter };
