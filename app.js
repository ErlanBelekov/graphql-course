const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Event = require('./models/event');
const User = require('./models/user');

const app = express();

app.use(bodyParser.json());

app.use(
  '/graphql',
  graphqlHTTP({
    schema: buildSchema(`
      type Event {
        _id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
      }

      type User {
        _id: ID!
        email: String!
        password: String
      }

      input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
      }

      input UserInput {
        email: String!
        password: String!
      }

      type RootQuery {
        events: [Event!]!
      }

      type RootMutation {
        createEvent(eventInput: EventInput): Event
        createUser(userInput: UserInput): User
      }

      schema {
        query: RootQuery
        mutation: RootMutation
      }
    `),
    rootValue: {
      events: () => {
        return Event.find()
          .then((events) => {
            return events.map((event) => ({
              ...event._doc,
              _id: event._doc._id.toString(),
            }));
          })
          .catch((e) => {
            console.error(e);
            throw e;
          });
      },
      createEvent: (args) => {
        const { title, description, price, date } = args.eventInput;
        const event = new Event({
          title,
          description,
          price,
          date: new Date(date),
          creator: '5f576f16be4a670d3d088567',
        });
        let createdEvent;

        return event
          .save()
          .then((result) => {
            createdEvent = { ...result._doc, _id: result._doc._id.toString() };
            return User.findById('5f576f16be4a670d3d088567');
          })
          .then((user) => {
            if (!user) {
              throw new Error('User not found');
            }
            user.createdEvents.push(event);
            return user.save();
          })
          .then((res) => createdEvent)
          .catch((e) => {
            console.log(e);
          });
      },
      createUser: (args) => {
        const { email, password } = args.userInput;
        return bcrypt
          .hash(password, 12)
          .then((hashedPass) => {
            const user = new User({ email, password: hashedPass });
            return user.save();
          })
          .then((res) => ({ ...res._doc, password: null, _id: res.id }))
          .catch((err) => {
            throw err;
          });
      },
    },
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
