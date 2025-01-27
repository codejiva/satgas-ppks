const db = require('../db');

// Mengambil semua janji temu
const getAllAppointments = (req, res) => {
  const query = 'SELECT * FROM appointments';
  db.query(query, (err, results) => {
    if (err) return res.status(500).send('Error fetching appointments');
    res.json(results);
  });
};

// Membuat janji temu baru
const createAppointment = (req, res) => {
  const { report_id, date, time } = req.body;

  const query = 'INSERT INTO appointments (report_id, date, time) VALUES (?, ?, ?)';
  db.query(query, [report_id, date, time], (err, results) => {
    if (err) return res.status(500).send('Error creating appointment');
    res.status(201).send('Appointment created successfully');
  });
};

// Mengupdate janji temu
const updateAppointment = (req, res) => {
  const { id } = req.params;
  const { date, time } = req.body;

  const query = 'UPDATE appointments SET date = ?, time = ? WHERE id = ?';
  db.query(query, [date, time, id], (err, results) => {
    if (err) return res.status(500).send('Error updating appointment');
    res.send('Appointment updated successfully');
  });
};

// Menghapus janji temu
const deleteAppointment = (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM appointments WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).send('Error deleting appointment');
    res.send('Appointment deleted successfully');
  });
};

module.exports = { getAllAppointments, createAppointment, updateAppointment, deleteAppointment };
