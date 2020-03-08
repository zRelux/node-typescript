import * as express from "express";
import passport from "passport";
import * as codes from "../../utils/codes";
import { UserModel } from "../../models/User";

const secureRoute = (
  fn: (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => (user: UserModel) => void
) => {
  return (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    passport.authenticate("jwt", { session: false }, async (error, user) => {
      if (!user || error) {
        return res.status(codes.ACCESS_DENIED).send(error);
      }

      return fn(req, res, next)(user);
    })(req, res, next);
  };
};

export default secureRoute;
