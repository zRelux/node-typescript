require("dotenv").config();

import express from "express";

import compression from "compression";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";

import passport from "passport";

import filterOrigin from "./middlewares/filterOrigin";
import { dbInit } from "./db";

import userRouteHandler from "./routes/User";

const app = express();
const port = process.env.PORT || 3000;

import "./services/auth";

app.use(morgan("dev"));

app.use(compression());
app.use(helmet());
app.use(cors());
app.use(filterOrigin());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(passport.initialize());

//API ROUTES

app.use("/api/user", userRouteHandler);

const appInit = async () => {
  await dbInit();
  console.log(`Example app listening on port ${port}!`);
};

app.listen(port, appInit);
