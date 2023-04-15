const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');

require('dotenv').config();

const auth = async (req, res, next) => {
  // check header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startswith('Bearer')) {
    throw new UnauthenticatedError('Invalid Credentials')
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.SECRET);

    // attach user
    const user = User.findById(payload.id).select('-password');
    req.user = user;

    next();
  } catch (error) {
    throw new UnauthenticatedError("Invalid Authentication")
  }
}

module.exports = auth;