const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');

const app = express();

const rootResolver = require('./graphql/resolvers');
const graphqlSchema = require('./graphql/schema');

app.use(bodyParser.json());

app.use(
  '/graphql',
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: rootResolver,
    graphiql: true,
  })
);

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PWD}@cluster0.wtfew.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    }
  )
  .then((res) => {
    console.log('connected to Mongo');
    app.listen(3000, () => console.log('server started'));
  })
  .catch((e) => {
    console.error(e);
  });
