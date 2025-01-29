const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { createReport, getUserReports, updateReport, deleteReport } = require('../controllers/reportController');

// Routes untuk pelapor
router.post('/', verifyToken, createReport); // Buat laporan baru
router.get('/', verifyToken, getUserReports); // Ambil laporan milik user saat ini
router.put('/:id', verifyToken, updateReport); // Update laporan tertentu
router.delete('/:id', verifyToken, deleteReport); // Hapus laporan tertentu

module.exports = router;
