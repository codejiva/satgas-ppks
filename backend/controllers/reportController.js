const db = require('../db');

// Menambahkan laporan
const createReport = (req, res) => {
    const { id_pelapor, title, description, location } = req.body;
  
    if (!id_pelapor || !title || !description || !location) {
      return res.status(400).send('All fields are required');
    }
  
    const query = `INSERT INTO reports (id_pelapor, title, description, location, status) VALUES (?, ?, ?, ?, 'pending')`;
  
    db.query(query, [id_pelapor, title, description, location], (err, results) => {
      if (err) {
        console.error('Error creating report:', err);
        return res.status(500).send('Error creating report');
      }
      res.status(201).send('Report created successfully');
    });
  };
  
// Mendapatkan semua laporan
const getReports = (req, res) => {
    const query = `SELECT * FROM reports`;
    db.query(query, (err, results) => {
        if (err) return res.status(500).send('Error fetching reports');
        res.status(200).json(results);
    });
};

// Update Report Status
const updateReportStatus = (req, res) => {
    const { id } = req.params;
    const { status, appointment_date, notes } = req.body;
  
    // Mengecek apakah user yang sedang login adalah Satgas
    if (req.user.role !== 'satgas') {
      return res.status(403).send('Forbidden: Only Satgas can update report status');
    }
  
    const query = `UPDATE reports SET status = ?, appointment_date = ?, notes = ? WHERE id = ?`;
    db.query(query, [status, appointment_date, notes, id], (err, results) => {
      if (err) return res.status(500).send('Error updating report status');
      res.status(200).send('Report status updated');
    });
};



module.exports = { createReport, getReports, updateReportStatus };
