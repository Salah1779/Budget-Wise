// server.js
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const crypto = require('crypto');
const db = require('./connexion'); 
const googleSignupRouter = require('./GoogleSignUp'); 
const authRouter = require('./auth');
const updateProfileRouter = require('./updateProfile'); 
const addRecordRouter = require('./addRecord');


const app = express();
const port = 5000;
const secret = crypto.randomBytes(64).toString('hex');
const IP='192.168.0.146';

// Middleware
app.use(express.json()); // Parse JSON requests
app.use(cors({
  origin: 'http://10.0.0.2:19000',
  methods: 'GET,POST,PUT,DELETE', 
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
app.use('/api', addRecordRouter); // Password update routes

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://${IP}:${port}`);
});