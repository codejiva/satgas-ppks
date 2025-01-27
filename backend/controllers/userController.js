const db = require('../db');
const bcrypt = require('bcryptjs');

// Bikin satgas
const createSatgas = (req, res) => {
  const { username, password, email } = req.body;
  
  if (!username || !password || !email) {
    return res.status(400).send('Username, password, and email are required');
  }

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error('Error hashing password:', err);
      return res.status(500).send('Error hashing password');
    }

    const query = `INSERT INTO users (username, password, role, email) VALUES (?, ?, 'satgas', ?)`;
    db.query(query, [username, hashedPassword, email], (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).send('Error creating satgas account');
      }
      res.status(201).send('Satgas account created successfully');
    });
  });
};

// Edit Satgas
const editSatgas = (req, res) => {
  const { id } = req.params;
  const { username, email, password } = req.body;

  let updateQuery = 'UPDATE users SET ';
  const updateValues = [];

  if (username) {
    updateQuery += 'username = ?, ';
    updateValues.push(username);
  }
  if (email) {
    updateQuery += 'email = ?, ';
    updateValues.push(email);
  }
  if (password) {
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        return res.status(500).send('Error hashing password');
      }
      updateQuery += 'password = ?';
      updateValues.push(hashedPassword);

      updateQuery += ' WHERE id = ?';
      updateValues.push(id);

      db.query(updateQuery, updateValues, (err, results) => {
        if (err) {
          console.error('Error executing query:', err);
          return res.status(500).send('Error updating satgas account');
        }
        res.status(200).send('Satgas account updated successfully');
      });
    });
    return;
  }

  // kalo gak update pass, pake query aja gausa di-hash
  updateQuery += ' WHERE id = ?';
  updateValues.push(id);

  db.query(updateQuery, updateValues, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).send('Error updating satgas account');
    }
    res.status(200).send('Satgas account updated successfully');
  });
};

// hapus Satgas
const deleteSatgas = (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM users WHERE id = ? AND role = "satgas"';
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).send('Error deleting satgas account');
    }
    if (results.affectedRows === 0) {
      return res.status(404).send('Satgas account not found');
    }
    res.status(200).send('Satgas account deleted successfully');
  });
};

module.exports = { createSatgas, editSatgas, deleteSatgas };
