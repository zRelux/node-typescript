import Sequelize, { BuildOptions, Model } from "sequelize";
import bcrypt from "bcrypt";
import { v4 } from "uuid";

import sequelize from "../../db";

// We need to declare an interface for our model that is basically what our class would be
export interface UserModel extends Model {
  readonly id: string;
  name: string;
  lastName: string;
  email: string;
  password: string;
}

// Need to declare the static model so `findOne` etc. use correct types.
type UserStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): UserModel;
};

const User = sequelize.define(
  "users",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: v4(),
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING
    },
    lastName: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    refreshToken: {
      type: Sequelize.STRING
    }
  },
  {}
) as UserStatic;

const hashCost = 10;
User.addHook("beforeCreate", async (user: UserModel) => {
  //Hash the password with a salt round of 10, the higher the rounds the more secure, but the slower your application becomes.
  const hashedPass = await bcrypt.hash(user.password, hashCost);

  // replace the plain pass with the hashed one
  user.password = hashedPass;
});

export default User;
