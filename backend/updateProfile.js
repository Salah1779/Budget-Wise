// routes/userRoutes.js
const express = require('express');
const bcrypt = require('bcrypt');
const connection = require('./connexion'); 
const verifyToken = require('./middleware/verifytoken'); 
const router = express.Router();

// Update password route with verifyToken middleware
router.put('/update-password', verifyToken, async (req, res) => {
  const { newPassword } = req.body;

  // Get the authenticated user's email from the token
  const email = req.user.email; // Extract email from the verified JWT

  // Hash the new password before storing
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the database
    connection.query(
      'UPDATE users SET password = ? WHERE email = ?',
      [hashedPassword, email],
      (err, result) => {
        if (err) {
          console.error('Error updating password:', err);
          return res.status(500).json({ error: 'Error updating password' });
        }

        res.status(200).json({ message: 'Password updated successfully' });
      }
    );
  } catch (error) {
    console.error('Error hashing password:', error);
    res.status(500).json({ error: 'Error updating password' });
  }
});

//compare password to the actual one
router.post('/verify-password', verifyToken, async (req, res) => {
    const { email, password } = req.body;
    
    try {
      // Query the database to get the user
      const query = 'SELECT password FROM users WHERE email = ?';
      connection.query(query, [email], (err, results) => {
        if (err) {
          console.error('Error querying the database:', err);
          res.setHeader('Content-Type', 'application/json'); // Set content type to JSON
          return res.status(500).json({ error: 'Internal server error' });
        }
  
        if (results.length === 0) {
          res.setHeader('Content-Type', 'application/json'); // Set content type to JSON
          return res.status(401).json({ error: 'User not found' });
        }
  
        const user = results[0];
        const isPasswordValid = bcrypt.compareSync(password, user.password);
  
        if (!isPasswordValid) {
          res.setHeader('Content-Type', 'application/json'); // Set content type to JSON
          return res.status(401).json({ error: 'Invalid password' });
        }
  
        res.setHeader('Content-Type', 'application/json'); // Set content type to JSON
        res.status(200).json({ message: 'Password verified successfully' });
      });
    } catch (error) {
      console.error('Error verifying password:', error);
      res.setHeader('Content-Type', 'application/json'); // Set content type to JSON
      res.status(500).json({ error: 'Internal server error' });
    }
  });


// Update profile data if changes occur
router.put('/update-profile', verifyToken, async (req, res) => {
  const { name, lastname, gender, image } = req.body;

  // Get the authenticated user's email from the token
  const email = req.user.email; // Extract email from the verified JWT

  // Extract the token from the Authorization header
  token=req.headers['authorization'].split(' ')[1];



  // Update the profile data in the database
  connection.query(
    'UPDATE users SET name = ?, lastname = ?, gender = ?, image = ? WHERE email = ?',
    [name, lastname, gender, image, email],
    (err, result) => {
      if (err) {
        console.error('Error updating profile data:', err);
        return res.status(500).json({ error: 'Error updating profile data' });
      }

      // Return updated user data and the token
      res.status(200).json({
        user: {
          name: name,
          lastname: lastname,
          gender: gender,
          image: image,
          email: email,
        },token
      });
    }
  );
});


router.post('/checkPassword', async (req, res) => {
  const { email } = req.body;

  try {
    // Query the database to check if the user has a password
    connection.query('SELECT password FROM users WHERE email = ?', [email], (err, results) => {
      if (err) {
        console.error('Error querying the database:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      const hasPassword = results[0].password !== null;
      return res.json({ hasPassword });
    });
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;


  
module.exports = router;
