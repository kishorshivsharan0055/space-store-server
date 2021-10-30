require("dotenv").config({ silent: true });
import path from "path";
import * as TypeORM from "typeorm";
import { __prod__ } from "./constants";
import { Products } from "./entities/Products";
import { Users } from "./entities/Users";

export default {
  type: "postgres",
  entities: [Users, Products],
  synchronize: false,
  // username: "kishorshivsharan",
  // password: "postgres",
  // database: "spacestore",
  url: process.env.DATABASE_URL,
  logging: false,
  migrations: [path.join(__dirname, "src/migrations/*")],
} as Parameters<typeof TypeORM.createConnection>[0];
