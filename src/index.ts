import path from "path";
import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeTypeDefs } from "@graphql-tools/merge";
import { configDotenv } from "dotenv";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { Neo4jGraphQL } from "@neo4j/graphql";
import neo4j from "neo4j-driver";
import resolvers from "./resolvers/index.js";

configDotenv();
const { NEOURI, NEOUSER, NEOPASS } = process.env;

const typesArray = loadFilesSync(path.join("./graph/", "*.graphql"));
const typeDefs = mergeTypeDefs(typesArray);

if (NEOURI === undefined || NEOUSER === undefined || NEOPASS === undefined) {
  throw `Couldn't start server due to undefined variables:
        ${NEOURI === undefined && "NEOURI"} ${
    NEOUSER === undefined && "NEOUSER"
  } ${NEOPASS === undefined && "NEOPASS"}`;
} else {
  const driver = neo4j.driver(NEOURI, neo4j.auth.basic(NEOUSER, NEOPASS));

  const neo4jGraphQL = new Neo4jGraphQL({
    typeDefs,
    driver,
    resolvers,
  });

  const schema = await neo4jGraphQL.getSubgraphSchema();

  const server = new ApolloServer({
    schema,
  });

  const shutdown = () => {
    console.log("Shutting down server");
    server.stop().then(async () => {
      // shut down neo4j driver
      await driver.close();
      console.log("Server stopped");
      process.exit();
    });
  };

  // Listen for SIGINT signal
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  const { url } = await startStandaloneServer(server);
  console.log(`🚀  Server ready at ${url}`);
}
