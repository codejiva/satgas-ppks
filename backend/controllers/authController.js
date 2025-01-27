const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

// Register User
const register = (req, res) => {
  const { username, password, role, email } = req.body;

  if (!username || !password || !role || !email) {
    return res.status(400).send('Username, password, role, and email are required');
  }

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error('Error hashing password:', err);
      return res.status(500).send('Error hashing password');
    }

    const query = `INSERT INTO users (username, password, role, email) VALUES (?, ?, ?, ?)`;
    db.query(query, [username, hashedPassword, role, email], (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).send('Error registering user');
      }
      console.log('User registered successfully:', results);
      res.status(201).send('User registered successfully');
    });
  });
};


// Login User
const login = (req, res) => {
  const { username, password } = req.body;

  const query = `SELECT * FROM users WHERE username = ?`;
  db.query(query, [username], (err, results) => {
    if (err) return res.status(500).send('Error fetching user');
    if (results.length === 0) return res.status(404).send('User not found');

    bcrypt.compare(password, results[0].password, (err, match) => {
      if (err) return res.status(500).send('Error comparing passwords');
      if (!match) return res.status(400).send('Invalid password');

      // Generate JWT token
      const token = jwt.sign(
        { id: results[0].id, username: results[0].username, role: results[0].role },
        'secretkey', // ganti pake secret key 
        { expiresIn: '1h' }
      );

      res.json({ token });
    });
  });
};

module.exports = { register, login };
