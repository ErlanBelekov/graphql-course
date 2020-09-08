const bcrypt = require('bcryptjs');

const Event = require('../../models/event');
const User = require('../../models/user');

const events = async (eventIDs) => {
  try {
    const events = await Event.find({ _id: { $in: eventIDs } });
    return events.map((event) => ({
      ...event._doc,
      _id: event.id,
      creator: user.bind(this, event.creator),
      date: new Date(event._doc.date).toISOString(),
    }));
  } catch (error) {
    throw err;
  }
};

const user = async (userID) => {
  try {
    const user = await User.findById(userID);
    return {
      ...user._doc,
      _id: user.id,
      createdEvents: events.bind(this, user._doc.createdEvents),
    };
  } catch (error) {
    throw err;
  }
};

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map((event) => ({
        ...event._doc,
        _id: event._doc._id.toString(),
        creator: user.bind(this, event._doc.creator),
        date: new Date(event._doc.date).toISOString(),
      }));
    } catch (error) {
      throw e;
    }
  },
  createEvent: async (args) => {
    const { title, description, price, date } = args.eventInput;
    const event = new Event({
      title,
      description,
      price,
      date: new Date(date),
      creator: '5f576f16be4a670d3d088567',
    });
    let createdEvent;

    try {
    } catch (error) {
      console.log(e);
    }

    const savedEvent = await event.save();

    createdEvent = {
      ...result._doc,
      _id: result._doc._id.toString(),
      creator: user.bind(this, result._doc.creator),
      date: new Date(result._doc.date).toISOString(),
    };

    const creator = await User.findById('5f576f16be4a670d3d088567');

    if (!creator) {
      throw new Error('User not found');
    }
    creator.createdEvents.push(event);

    await creator.save();

    return createdEvent;
  },
  createUser: async (args) => {
    const { email, password } = args.userInput;

    try {
      const hashedPass = await bcrypt.hash(password, 12);

      const user = new User({ email, password: hashedPass });

      const savedUser = await user.save();

      return { ...savedUser._doc, password: null, _id: savedUser.id };
    } catch (error) {
      throw err;
    }
  },
};
