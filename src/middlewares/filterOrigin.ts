import * as express from "express";
import * as codes from "../utils/codes";

export default () => (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (req.header("x-api-key") === process.env.API_KEY) {
    next();
  } else {
    res.status(codes.ACCESS_DENIED).json("Access Denied!!!");
  }
};
