const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

require('../db/connect');

const inviteSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['sent', 'received']
  },
  organizerId: {
    type: String,
    required: true
  },
  roomId: {
    type: String,
    required: true
  },
  key: {
    type: String,
    required: true
  }
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    required: false,
    default: 'avatar_default.png'
  },
  banned: {
    type: Boolean,
    required: true,
    default: false
  },
  rooms: [{
    type: String
  }],
  invites: [inviteSchema],
  token: {
    type: String
  }
});

userSchema.statics.findByCredentials = async function (username, password) {
  const user = await User.findOne({ username });

  if (!user) {
    throw new Error('User not found');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error('Incorrect password');
  }

  return user;
};

userSchema.methods.generateAuthToken = async function () {
  try {
    const user = this;

    const token = jwt.sign({ _id: user._id }, process.env.JWTKEY);

    user.token = token;

    await user.save();

    return token;
  } catch (error) {
    console.error('Error generating auth token:', error);
    throw error;
  }
};

userSchema.index({ 'username': 1 }, { unique: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
