// GoogleSignUp.js
const express = require('express');
const connection = require('./connexion.js'); // Assuming this exports a single MySQL connection
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const dotenv = require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;
const EXPIRATION_TIME = '1h'; // Token expiration time
console.log('JWT_SECRET:', JWT_SECRET);

router.post('/google-signup', (req, res) => {
  const { email, name, lastname, image } = req.body;

  console.log('Request body:', req.body);

  // Check if the user already exists
  connection.query('SELECT * FROM users WHERE email = ?', [email], (err, rows) => {
    if (err) {
      console.error('Error querying the database:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (rows.length > 0) {
      // User exists, create a JWT token and send it back
      const user = rows[0];
      const token = jwt.sign(
        {
          id: user.id_user,
          name: user.name,
          lastname: user.lastname,
          email: user.email
        },
        JWT_SECRET,
        { expiresIn: EXPIRATION_TIME } // Token expires in 1 hour
      );
      console.log('User found, generating token:', token);

      return res.status(200).json({ user: {
        id: user.id_user,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        image: user.image,
        gender: user.gender,
      }, token });
    } else {
      // User does not exist, add the new user
      connection.query('INSERT INTO users (email, name, lastname, image) VALUES (?, ?, ?, ?)', [email, name, lastname, image], (err, result) => {
        if (err) {
          console.error('Error inserting into the database:', err);
          return res.status(500).json({ error: 'Database error' });
        }

        // Create a JWT token after inserting the new user
        const token = jwt.sign(
          {
            id: result.insertId,
            name: name,
            lastname: lastname,
            email: email
          },
          JWT_SECRET,
          { expiresIn: EXPIRATION_TIME } // Token expires in 1 hour
        );
        console.log('User created, generating token:', token);

        return res.status(200).json({ user: {
          id: result.insertId,
          name: name,
          lastname: lastname,
          email: email,
          image: image,
          gender: user.gender, 
        } ,token});
      });
    }
  });
});

module.exports = router;