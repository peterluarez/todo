import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import mongoose from "mongoose";
import cors from "cors";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { mergeResolvers } from "@graphql-tools/merge";
import { todoTypeDefs } from "./graphql/todo/typeDefinition.js";
import { todoResolvers } from "./graphql/todo/resolvers.js";
import { userTypeDefs } from "./graphql/user/typeDefinition.js";
import { userResolvers } from "./graphql/user/resolvers.js";
import "dotenv/config.js";

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 4000;

async function startServer() {
  const mergeAllResolver = mergeResolvers([todoResolvers, userResolvers]);
  const schema = makeExecutableSchema({
    typeDefs: [todoTypeDefs, userTypeDefs],
    resolvers: mergeAllResolver,
  });

  await mongoose.connect(MONGO_URI as string);
  console.log("MongoDB connected");

  const app = express();
  const server = new ApolloServer({ schema });
  await server.start();

  app.use("/graphql", cors(), express.json(), expressMiddleware(server));

  app.listen(PORT, () => {
    console.log(`Server ready at http://localhost:${PORT}/graphql`);
  });
}

startServer();