const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async function(req, res, next) {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Invalid Authorization header');
    }
    const token = authHeader.replace(/^Bearer\s/, '');

    const decoded = jwt.verify(token, process.env.JWTKEY);

    const user = await User.findOne({ _id: decoded._id, token: token });

    if (!user) {
      throw new Error('User not found');
    }

    req.user = user;
    req.token = token;
    next();

  } catch (error) {
    res.status(401).send({ error: 'Authentication not done' });
  }
};

module.exports = auth;
