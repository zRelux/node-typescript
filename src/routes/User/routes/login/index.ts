import * as express from "express";
import passport from "passport";

import * as codes from "../../../../utils/codes";

import { UserModel } from "../../../../models/User";
import { loginUser } from "../../../../controllers/User";

const login = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  passport.authenticate(
    "local",
    { session: false },
    async (error, user: UserModel) => {
      if (error || !user) {
        res.status(codes.BAD_REQUEST).json({ error });
      }

      const tokens = await loginUser(user);

      res.status(codes.SUCCESS).send({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken
      });
    }
  )(req, res, next);
};

export default login;
