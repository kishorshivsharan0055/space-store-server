import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import "dotenv-safe/config";
import express from "express";
import http from "http";
import redis from "ioredis";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import {
  ConnectionNotFoundError,
  createConnection,
  getConnection,
} from "typeorm";
import { ProductsResolver } from "./resolvers/productsResolver";
import { UserResolver } from "./resolvers/userResolver";
import typeormConfig from "./typeorm.config";
import { authChecker } from "./utils/graphqlUtils";
require("dotenv").config({ silent: true });

const PORT = process.env.PORT || 8000;
const Main = async () => {
  let db_retries = 5;

  while (db_retries) {
    try {
      try {
        getConnection();
      } catch (err) {
        if (err.constructor !== ConnectionNotFoundError) throw err;
        await createConnection(typeormConfig);
      }

      break;
    } catch (err) {
      db_retries -= 1;
      console.error(err);
      console.warn("DB Retries Left: ", db_retries);
      await new Promise((res) => setTimeout(res, 2000));
    }
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

  const redisClient = new redis(process.env.REDIS_URL);

  redisClient.on("error", (err: any) => {
    console.error("Redis Error" + err);
  });

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

  app.get("/", (_req, res) => res.send("PING"));

  const httpServer = http.createServer(app);
  apolloServer.installSubscriptionHandlers(httpServer);

  httpServer.listen(PORT, () => {
    console.log(`Server is up and running on http://localhost:${PORT}`);
  });
};

Main().catch((err) => {
  console.error(err);
});
