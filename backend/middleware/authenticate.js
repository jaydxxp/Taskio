const jwt = require('jsonwebtoken');
const User = require('../model/user');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || process.env.jwt;

module.exports = async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization || req.headers['x-access-token'] || '';
    const token = (typeof authHeader === 'string' && authHeader.startsWith('Bearer '))
      ? authHeader.split(' ')[1]
      : authHeader;

    if (!token) {
      return res.status(401).json({ error: 'Authentication token missing' });
    }

    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

 
    const uid = payload && (payload.userId || payload.id || payload.uid);
    if (!uid) return res.status(401).json({ error: 'Invalid token payload' });

    const user = await User.findById(uid).select('-password').lean();
    if (!user) {
      return res.status(401).json({ error: 'User not found for provided token' });
    }

    req.user = user;
    return next();
  } catch (err) {

    console.error('Authentication error:', err);
    return res.status(500).json({ error: 'Authentication failure' });
  }
};