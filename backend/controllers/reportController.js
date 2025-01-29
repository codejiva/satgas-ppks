const db = require('../db');

exports.createReport = (req, res) => {
    const { title, description } = req.body;
    const query = 'INSERT INTO reports (title, description, user_id) VALUES (?, ?, ?)';
    
    db.query(query, [title, description, req.user.id], (err, results) => {
        if (err) return res.status(500).json({ message: 'Error creating report' });
        res.status(201).json({ message: 'Report created successfully' });
    });
};

exports.getReports = (req, res) => {
    db.query('SELECT * FROM reports', (err, results) => {
        if (err) return res.status(500).json({ message: 'Error fetching reports' });
        res.json(results);
    });
};

exports.updateReport = (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;
    
    const query = 'UPDATE reports SET title = ?, description = ? WHERE id = ?';
    db.query(query, [title, description, id], (err, results) => {
        if (err) return res.status(500).json({ message: 'Error updating report' });
        res.json({ message: 'Report updated successfully' });
    });
};

exports.deleteReport = (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM reports WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ message: 'Error deleting report' });
        res.json({ message: 'Report deleted successfully' });
    });
};
