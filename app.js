import dotenv from 'dotenv'
import express from 'express';
import http from 'http';
import cors from 'cors';
import { connectDB } from './database/connectDB.js';
import { ApolloServer } from "@apollo/server"
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';

import mergedTypeDefs from "./typeDefs/index.js"
import mergedResolvers from "./resolvers/index.js"

dotenv.config();
const PORT = process.env.PORT;
const app = express();

const httpServer = http.createServer(app);

const server = new ApolloServer({
  typeDefs: mergedTypeDefs,
  resolvers: mergedResolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

app.use(
  '/',
  cors(),
  express.json(),
  expressMiddleware(server, {
    context: async ({ req }) => ({ token: req.headers.token }),
  }),
);

// Modified server startup
await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));

const url = `http://localhost:${PORT}/`
console.log(`🚀🚀🚀 Server ready at ${url}`)
await connectDB()