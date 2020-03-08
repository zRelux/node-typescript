import * as express from "express";
import { validationResult, ValidationChain } from "express-validator";

import * as codes from "./codes";

const validate = (validations: ValidationChain[]) => {
  return async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(codes.BAD_REQUEST).json({ errors: errors.array() });
  };
};

export default validate;
