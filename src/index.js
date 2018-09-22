const { GraphQLServer } = require('graphql-yoga');
const { Prisma } = require('prisma-binding');

// BASE Type definitions are put in
// db/datamodel.graphql then by
// running 'prisma deploy', are translated
// into the prisma.graphql schema.

// requirements for various resolver types
const Query = require('./resolvers/Query');
const Mutation = require('./resolvers/Mutation');
const Subscription = require('./resolvers/Subscription');
const AuthPayload = require('./resolvers/AuthPayload');
const Feed = require('./resolvers/Feed');

// Resolvers
const resolvers = {
  Query,
  Mutation,
  Subscription,
  AuthPayload,
  Feed
};

//Server definition
const server = new GraphQLServer({
  typeDefs: './src/schema.graphql', //Looks like relative path from package.json
  resolvers,
  context: req => ({
    ...req,
    db: new Prisma({
      typeDefs: 'src/generated/prisma.graphql',
      endpoint: 'https://us1.prisma.sh/brent-soles/hackernews-clone-node/dev',
      secret: 'secret123',
      debug: true
    })
  })
});
server.start(() => console.log(`Running on http://localhost:4000/`));