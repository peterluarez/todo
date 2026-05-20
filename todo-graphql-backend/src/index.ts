// import { ApolloServer } from "apollo-server";
import { ApolloServer } from "@apollo/server";
import mongoose from "mongoose";
import { typeDefs } from "./graphql/todo/typeDef";
import { resolvers } from "./graphql/todo/resolvers";
import { startStandaloneServer } from "@apollo/server/standalone";
import * as dotenv from "dotenv";

// const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/todos";
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/todos";

async function startServer() {
  await mongoose.connect(MONGO_URI);
  console.log("MongoDB connected");

  const server = new ApolloServer({ typeDefs, resolvers });
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });
  console.log(`Server ready at ${url}`);
}

dotenv.config();
startServer();