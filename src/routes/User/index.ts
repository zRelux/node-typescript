import express from "express";

import User from "../../models/User";

import secureRoute from "../../services/auth/secureRoute";

import register from "./routes/register";
import login from "./routes/login";
import getWatches from "./routes/getWatches";

const router = express.Router();

// TEMP TESTING ROUTES
router.get("/", async (_, res) => {
  const users = await User.findAll();

  res.json(users);
});

router.get("/deleteAll", async (_, res) => {
  await User.destroy({
    where: {},
    truncate: true
  });

  res.json("Users deleted");
});

// END TEMP TESTING ROUTES

router.get("/watches", secureRoute(getWatches));

router.post("/register", register);
router.post("/login", login);

// TEMP PROTECTED ROUTE
router.get(
  "/protected",
  secureRoute((_, res) => () => {
    res.status(200).send("Secure route YEAH!!");
  })
);

export default router;
