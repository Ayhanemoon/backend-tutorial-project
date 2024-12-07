/* eslint-disable no-magic-numbers */
const jwt = require('jsonwebtoken');
const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    return res
      .status(401)
      .json({ message: 'Access Denied. No token provided.' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(400).json({ message: 'Invalid token.', err });
  }
};
module.exports = authenticateJWT;
