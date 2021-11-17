import { RequestHandler, Router } from "express";
import { short, tag } from "git-rev-sync";
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
    res.send({ data: { short: short(), full: tag() } });
  });

  return infrastructureRouter;
};

export { makeInfrastructureRouter };
