require("dotenv").config({ silent: true });
import path from "path";
import * as TypeORM from "typeorm";
import { __prod__ } from "./constants";
import { Products } from "./entities/Products";
import { User } from "./entities/User";

export default {
  type: "postgres",
  entities: [User, Products],
  synchronize: true,
  username: "kishorshivsharan",
  password: "postgres",
  database: "spacestore",
  // url: process.env.DATABASE_URL,
  logging: true,
  migrations: [path.join(__dirname, "./migrations/*")],
} as Parameters<typeof TypeORM.createConnection>[0];
