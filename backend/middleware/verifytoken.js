// middleware/verifyToken.js
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET ;

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
     
    }

    // Check if token is expiring soon (e.g., within 15 minutes)
    const expTime = user.exp * 1000; // Convert to milliseconds
    const currentTime = Date.now();
    const timeLeft = expTime - currentTime;

    // If token is expiring in less than 15 minutes, generate a new token
    if (timeLeft < 15 * 60 * 1000) {
      const newToken = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
      res.setHeader('Authorization', `Bearer ${newToken}`);
    }

    req.user = user; // Attach the decoded user info to the request object
    next();
  });
};

module.exports = verifyToken;
