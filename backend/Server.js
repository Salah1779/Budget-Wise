// server.js
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const crypto = require('crypto');
const db = require('./connexion'); // Ensure the correct path to your MySQL connection
const googleSignupRouter = require('./GoogleSignUp'); // Ensure correct path
const authRouter = require('./auth'); // Ensure correct path
const updateProfileRouter = require('./updateProfile'); // Import setpassword routes

const app = express();
const port = 4000;
const secret = crypto.randomBytes(64).toString('hex');

// Middleware
app.use(express.json()); // Parse JSON requests
app.use(cors({
  origin: 'http://10.0.0.2:19000', // Replace with your frontend URL
  methods: 'GET,POST,PUT,DELETE', // Allow these HTTP methods
  credentials: true, // Allow credentials like cookies
}));

// Session configuration
app.use(
  session({
    secret: secret,
    resave: false,
    saveUninitialized: false,
    cookie: { 
      maxAge: 60 * 60 * 1000, // 1 hour expiration
      httpOnly: true, // Not accessible via JavaScript on the client-side
      secure: false, // Set to true if using HTTPS
    },
  })
);

// Use routers
app.use('/api', googleSignupRouter); // Google sign-up routes
app.use('/api', authRouter); // Authentication routes
app.use('/api', updateProfileRouter ); // Password update routes

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://192.168.11.104:${port}`);
});
