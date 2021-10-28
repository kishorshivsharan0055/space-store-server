import "dotenv-safe/config";
import path from "path";
import * as TypeORM from "typeorm";
import { __prod__ } from "./constants";
import { Products } from "./entities/Products";
import { User } from "./entities/User";

export default {
  type: "postgres",
  entities: [User, Products],
  synchronize: true,
  database: "spacestore",
  url: process.env.DATABASE_URL,
  logging: false,
  migrations: [path.join(__dirname, "./migrations/*")],
} as Parameters<typeof TypeORM.createConnection>[0];
