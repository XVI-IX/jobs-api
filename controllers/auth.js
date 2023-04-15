require('dotenv').config();
const { BadRequestError, UnauthenticatedError } = require('../errors');
const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');


const register = async (req, res) => {

  const user = await User.create({ ...req.body });
  const token = user.createJWT();

  res.status(StatusCodes.CREATED).json({ 
    user: {
      name: user.name
    },
    token });
  
}

const login = async (req, res) => {
  const { email, password } = req.body;

  console.log(email, password);

  if (!email || !password) {
    throw new BadRequestError('Please provide email and password');
  }

  const user = await User.findOne({email});

  if (!user) {
    throw new UnauthenticatedError('invalid Credentials');
  }
  console.log(user);

  const correctPassword = await user.comparePassword(password);
  console.log(correctPassword);

  if (!correctPassword) {
    throw new UnauthenticatedError('Invalid password');
  }

  const token = user.createJWT();
  res.status(StatusCodes.OK).json({user: {
    name: user.name},
    token})
}

module.exports = {
  register,
  login
}