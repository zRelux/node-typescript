import * as express from "express";

import * as codes from "../../../../utils/codes";
import { UserModel } from "../../../../models/User";

const getWatches = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => async (user: UserModel) => {
  const watches = await user.getWatches();
  console.log(watches);

  res.status(codes.SUCCESS).json(watches);
};

export default getWatches;
