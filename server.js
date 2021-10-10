const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const http = require("http");
const path = require("path");
const mongoose = require("mongoose");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { mergeTypeDefs, mergeResolvers } = require("@graphql-tools/merge");
const { loadFilesSync } = require("@graphql-tools/load-files");
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const { SubscriptionServer } = require("subscriptions-transport-ws");
const { execute, subscribe } = require("graphql");

console.log("dix");
// express server
const app = express();

// db
const db = async () => {
  try {
    const success = await mongoose.connect(process.env.DATABASE_CLOUD, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log("DB Connected");
  } catch (error) {
    console.log("DB Connection Error", error);
  }
};
// execute database connection
db();

//Middlewares
app.use(cors());
app.use(bodyParser.json({ limit: "5mb" }));

const typeDefs = mergeTypeDefs(
  loadFilesSync(path.join(__dirname, "./typeDefs"))
);

const resolvers = mergeResolvers(
  loadFilesSync(path.join(__dirname, "./resolvers"))
);

const schema = makeExecutableSchema({ typeDefs, resolvers });

async function startServer() {
  apolloServer = new ApolloServer({
    schema,
    plugins: [
      {
        async serverWillStart() {
          return {
            async drainServer() {
              subscriptionServer.close();
            },
          };
        },
      },
    ],
    context: ({ req }) => ({ req }),
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });
}

startServer();

//server

const httpserver = http.createServer(app);

const subscriptionServer = SubscriptionServer.create(
  {
    // This is the `schema` we just created.
    schema,
    // These are imported from `graphql`.
    execute,
    subscribe,
  },
  {
    // This is the `httpServer` we created in a previous step.
    server: httpserver,
    // This `server` is the instance returned from `new ApolloServer`.
    path: apolloServer.graphqlPath,
  }
);

// port
httpserver.listen(process.env.PORT, function () {
  console.log(`server is ready at http://localhost:${process.env.PORT}`);
  console.log(
    `graphql-server is ready at http://localhost:${process.env.PORT}${apolloServer.graphqlPath}`
  );
});
