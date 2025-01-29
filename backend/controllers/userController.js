const db = require('../db');

// Buat akun Satgas
exports.createSatgas = (req, res) => {
    const { username, password, role } = req.body;
    if (!username || !password || role !== 'satgas') {
        return res.status(400).json({ message: 'Invalid input' });
    }

    const query = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';
    db.query(query, [username, password, role], (err, results) => {
        if (err) return res.status(500).json({ message: 'Error creating Satgas' });
        res.status(201).json({ message: 'Satgas created successfully' });
    });
};

// Edit akun Satgas
exports.editSatgas = (req, res) => {
    const { id } = req.params;
    const { username, password } = req.body;

    const query = 'UPDATE users SET username = ?, password = ? WHERE id = ? AND role = "satgas"';
    db.query(query, [username, password, id], (err, results) => {
        if (err) return res.status(500).json({ message: 'Error updating Satgas' });
        res.status(200).json({ message: 'Satgas updated successfully' });
    });
};

// Hapus akun Satgas
exports.deleteSatgas = (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM users WHERE id = ? AND role = "satgas"';
    db.query(query, [id], (err, results) => {
        if (err) return res.status(500).json({ message: 'Error deleting Satgas' });
        res.status(200).json({ message: 'Satgas deleted successfully' });
    });
};
