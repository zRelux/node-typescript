import jwt from "jsonwebtoken";

import User, { UserModel } from "../../models/User";

const secret = process.env.JWT_SECRET || "";
const accessExpiry = process.env.JWT_ACCESS_EXPIRY || "15m";
const refreshExpiry = process.env.JWT_REFRESH_EXPIRY || "4w";

const createToken = (email: string, expiry: string) =>
  jwt.sign(
    {
      email
    },
    secret,
    { expiresIn: expiry }
  );

export const createNewUser = async ({
  email,
  password,
  name,
  lastName
}: UserModel) => {
  const accessToken = createToken(email, accessExpiry);

  const refreshToken = createToken(email, refreshExpiry);

  const user = await User.create({
    name,
    lastName,
    email,
    password,
    refreshToken
  });

  return {
    user,
    accessToken,
    refreshToken
  };
};

export const loginUser = async (user: UserModel) => {
  const accessToken = createToken(user.email, accessExpiry);

  const refreshToken = createToken(user.email, refreshExpiry);

  await User.update(
    {
      refreshToken
    },
    { where: { email: user.email } }
  );

  return {
    accessToken,
    refreshToken
  };
};
