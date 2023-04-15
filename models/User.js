require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    minlength: 3,
    maxlength: 50
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide valid email"
    ],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 8,
  }
});

UserSchema.pre('save', async function () {

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.createJWT = function () {
  return jwt.sign(
    {userId: this._id,
    name: this.name}, process.env.SECRET,
    {expiresIn: process.env.JWT_LIFE}
  )
}

UserSchema.methods.comparePassword = async function (reqPassword) {
  try {
    const match = await bcrypt.compare(reqPassword, this.password);
    return match;
  } catch (error) {
    throw new UnauthenticatedError("Please provide password");
  }
}


module.exports = mongoose.model('user', UserSchema);