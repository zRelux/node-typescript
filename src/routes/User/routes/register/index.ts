import * as express from "express";
import { body } from "express-validator";

import * as codes from "../../../../utils/codes";
import validate from "../../../../utils/validation";

import User from "../../../../models/User";
import { createNewUser } from "../../../../controllers/User";

const register =
  (validate([
    body("name").isLength({ min: 2, max: 255 }),
    body("lastName").isLength({ min: 2, max: 255 }),
    body("email")
      .isEmail()
      .normalizeEmail()
      .custom(value => {
        return User.findAll({
          where: {
            email: value
          }
        }).then(user => {
          if (user.length > 0) {
            return Promise.reject("E-mail already in use");
          } else {
            return Promise.resolve("Email is acceptable");
          }
        });
      }),
    body("password").isLength({ min: 8 }),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password confirmation does not match password");
      }
      return true;
    })
  ]),
  async (req: express.Request, res: express.Response) => {
    const createdUser = await createNewUser(req.body);

    res.status(codes.SUCCESS).send({
      registered: true,
      accessToken: createdUser.accessToken,
      refreshToken: createdUser.refreshToken
    });
  });

export default register;
