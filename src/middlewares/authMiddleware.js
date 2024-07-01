const jwt = require('jsonwebtoken');
JWT_SECRET = "qjkslfhguy456etziqlmd18sflbwkgb9fnlsdlfk4hsdrnwldmfmqsdlgjhor" 
const User = require('../models/index');

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;
