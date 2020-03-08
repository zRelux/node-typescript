import { Sequelize } from "sequelize";

let sequelize: Sequelize;

const dbDefaults = {
  DB_URI: "postgres://postgres:postgres@localhost:5432/mywatches"
};

sequelize = new Sequelize(process.env.DB_URI || dbDefaults.DB_URI, {
  logging: process.env.NODE_ENV === "production" ? false : console.log
});

const dbInit = async () => {
  await sequelize.authenticate().catch((err: Error) => {
    console.error("Unable to connect to the database:", err);
  });

  await sequelize.sync();
};

export default sequelize;
export { dbInit };
