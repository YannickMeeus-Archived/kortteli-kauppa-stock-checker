import type { RequestHandler } from "express";

type RequireApiKey = (apiKey: string) => RequestHandler;

const MakeRequireApiKey: RequireApiKey = (apiKey) => (req, res, next) => {
  if (!req.headers["x-api-key"] || req.headers["x-api-key"] !== apiKey) {
    res.status(401).send("Unauthorized");
  } else {
    next();
  }
};
export { MakeRequireApiKey };
