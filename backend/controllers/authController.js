const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

// Register User
exports.register = (req, res) => {
    const { username, password, role, email } = req.body;
    if (!username || !password || !role || !email) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ message: 'Error hashing password' });
        }

        const query = 'INSERT INTO users (username, password, role, email) VALUES (?, ?, ?, ?)';
        db.query(query, [username, hashedPassword, role, email], (err, results) => {
            if (err) return res.status(500).json({ message: 'Error registering user' });
            res.status(201).json({ message: 'User registered successfully' });
        });
    });
};

// Login User
exports.login = (req, res) => {
    const { usernameOrEmail, password } = req.body;

    // Query untuk mencari user berdasarkan username atau email
    const query = 'SELECT * FROM users WHERE username = ? OR email = ?';

    db.query(query, [usernameOrEmail, usernameOrEmail], (err, results) => {
        if (err) return res.status(500).json({ message: 'Error fetching user' });
        if (results.length === 0) return res.status(404).json({ message: 'User not found' });

        bcrypt.compare(password, results[0].password, (err, match) => {
            if (err) return res.status(500).json({ message: 'Error comparing passwords' });
            if (!match) return res.status(400).json({ message: 'Invalid password' });

            // Generate JWT token
            const token = jwt.sign(
                { id: results[0].id, username: results[0].username, role: results[0].role },
                'secretkey',
                { expiresIn: '1h' }
            );

            res.json({ token });
        });
    });
};

// Get user profile
exports.getUserProfile = (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    res.json({ username: req.user.username, role: req.user.role });
};

// Update user profile
exports.updateProfile = async (req, res) => {
    const { username, email, password } = req.body;
    const userId = req.user.id; // Ambil ID user dari token

    if (!email && !password) {
        return res.status(400).json({ message: 'Email atau password harus diisi' });
    }

    try {
        let query = 'UPDATE users SET ';
        const params = [];

        if (username) {
            query += 'username = ?, ';
            params.push(username);
        }

        if (email) {
            query += 'email = ?, ';
            params.push(email);
        }

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            query += 'password = ?, ';
            params.push(hashedPassword);
        }

        // Hapus koma terakhir dan tambahkan WHERE clause
        query = query.slice(0, -2) + ' WHERE id = ?';
        params.push(userId);

        db.query(query, params, (err, results) => {
            if (err) return res.status(500).json({ message: 'Error updating profile' });
            res.json({ message: 'Profile updated successfully' });
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

