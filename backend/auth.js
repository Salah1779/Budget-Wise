const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const connection = require('./connexion'); 
const router = express.Router();
const dotenv = require('dotenv').config();


const JWT_SECRET = process.env.JWT_SECRET;
const EXPIRATION_TIME = '1h';
// Login route

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Check if the user exists in the database
  connection.query('SELECT * FROM users WHERE email = ?', [email], async (err, rows) => {
    if (err) {
      console.error('Error querying the database:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (rows.length === 0) {
      // Invalid email or user does not exist
      return res.status(401).json({ error:  "Invalid email or user does not exist"});
    }

    const user = rows[0];

    try {
      // Debugging: log fetched user data
      console.log('Fetched user:', user);

      // Compare the provided password with the stored hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      // Debugging: log the password comparison result
      console.log('Password comparison result:', isPasswordValid);

      if (!isPasswordValid) {
        // Password does not match
        return res.status(401).json({ error: '*Wrong password' });
      }

      // Password is valid, create a JWT token
      const token = jwt.sign(
        {
          id: user.id_user,
          name: user.name,
          lastname: user.lastname,
          email: user.email,
        },
        JWT_SECRET,
        { expiresIn: EXPIRATION_TIME } // Set your expiration time accordingly
      );

      // Respond with the token
      return res.status(200).json({
        user: {
          id: user.id_user,
          name: user.name,
          lastname: user.lastname,
          email: user.email,
          image: user.image,
          gender: user.gender,
        },
        token,
      });
    } catch (bcryptError) {
      console.error('Error during password validation:', bcryptError);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
});





module.exports = router;
