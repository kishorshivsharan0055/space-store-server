import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import express from "express";
import http from "http";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import {
  ConnectionNotFoundError,
  createConnection,
  getConnection,
} from "typeorm";
import { ProductsResolver } from "./resolvers/productsResolver";
import { UserResolver } from "./resolvers/userResolver";
import { authChecker } from "./utils/graphqlUtils";
import path from "path";
import { Users } from "./entities/Users";
import { Products } from "./entities/Products";
require("dotenv").config({ silent: true });

const PORT = process.env.PORT || 8000;
const Main = async () => {
  try {
    const conn = await createConnection({
      type: "postgres",
      url: process.env.DATABASE_URL,
      logging: true,
      synchronize: true,
      entities: ["dist/entities/*.js"],
    });

    await conn.runMigrations();

    if (conn.isConnected) console.log("Database connected");
    else console.log("Database not connected");
  } catch (err) {
    console.log(err);
  }

  const corsOrigins = ["http://localhost:3000"];
  const app = express();

  app.use(express.json({ limit: "50mb" }));
  app.use(
    cors({
      origin: corsOrigins,
      credentials: true,
    })
  );

  const schema = await buildSchema({
    resolvers: [UserResolver, ProductsResolver],
    authChecker: authChecker,
  });

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res, connection }) => ({
      req,
      res,
      connection,
    }),
  });

  apolloServer.applyMiddleware({
    app,
    cors: false,
    bodyParserConfig: {
      limit: "50mb",
      type: "application/json",
    },
  });

  app.get("/", (_req, res) => {
    res.send("PING");
  });

  const httpServer = http.createServer(app);
  apolloServer.installSubscriptionHandlers(httpServer);

  httpServer.listen(PORT, () => {
    console.log(`Server is up and running on http://localhost:${PORT}`);
  });
};

Main().catch((err) => {
  console.error(err);
});
