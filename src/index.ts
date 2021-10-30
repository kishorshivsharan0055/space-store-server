import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import express from "express";
import http from "http";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { Products } from "./entities/Products";
import { Users } from "./entities/Users";
import { ProductsResolver } from "./resolvers/productsResolver";
import { UserResolver } from "./resolvers/userResolver";
import { authChecker } from "./utils/graphqlUtils";
require("dotenv").config();

const PORT = process.env.PORT || 8000;
const Main = async () => {
  const conn = await createConnection({
    type: "postgres",
    url: "postgres://ywgfvksjxuhwhf:c49c5387026296162b2def05efd120bcc7b40ceb5c1ec8f51d1c8196a72b1ce3@ec2-44-199-158-170.compute-1.amazonaws.com:5432/d7foelic23r8ie",
    logging: true,
    synchronize: true,
    entities: [Users, Products],
  });

  await conn.runMigrations();

  if (conn.isConnected) console.log("Database connected");
  else console.log("Database not connected");

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
