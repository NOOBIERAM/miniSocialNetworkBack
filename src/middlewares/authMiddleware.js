const jwt = require('jsonwebtoken');
const User = require('../models/index');

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  console.log(req.header('Authorization'));
  console.log(token);
  if (!token) return res.status(401).json({ message: 'No token provided' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SIGN);
    req.user = {
      id: decoded.id, 
      name: decoded.name,
      firstname: decoded.firstname,
      email: decoded.email,
      image: decoded.image
    };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;
