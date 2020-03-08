import * as express from "express";
import passport from "passport";
import Local from "passport-local";
import passportJWT from "passport-jwt";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import JWTStrategy = passportJWT.Strategy;
import UserModel from "../../models/User";

const LocalStrategy = Local.Strategy;

const checkBearer = (req: express.Request) => {
  let token = req.headers["authorization"];

  if (typeof token === "string") {
    if (token.startsWith("Bearer ")) {
      // Remove Bearer from string
      token = token.slice(7, token.length);
      return token;
    }
  }

  return null;
};

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password"
    },
    async (username, password, done) => {
      try {
        const users = await UserModel.findAll({
          where: {
            email: username
          }
        });

        if (users.length > 1) {
          console.log("Troppi utenti con quel email");
          throw Error("Troppi utenti con quel email");
        }

        if (users.length == 0) {
          console.log("Utente non presente");
          throw Error("Utente non presente");
        }

        const user = users[0];

        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (passwordsMatch) {
          return done(null, user);
        } else {
          return done("Email and password sbagliate");
        }
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: req => checkBearer(req),
      secretOrKey: process.env.JWT_SECRET
      // issuer: "accounts.examplesoft.com",
      // audience: "yoursite.net"
    },
    async (jwtPayload, done) => {
      try {
        const decoded: any = jwt.verify(
          jwtPayload,
          process.env.JWT_SECRET || ""
        );

        if (typeof decoded !== "string") {
          const users = await UserModel.findAll({
            where: {
              email: decoded.email
            }
          });

          return done(null, users[0]);
        }

        return done(null, decoded);
      } catch (err) {
        return done(err);
      }
    }
  )
);
