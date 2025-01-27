const express = require('express');
const router = express.Router();
const { createReport, getReports, updateReportStatus } = require('../controllers/reportController');
const { authorizeSatgas } = require('../middleware/authMiddleware');

// Menambahkan laporan (semua user bisa)
router.post('/', createReport);

// Mendapatkan semua laporan (semua user bisa)
router.get('/', getReports);

// Update status laporan, hanya Satgas yang bisa
router.put('/:id', authorizeSatgas, updateReportStatus);

// 

module.exports = router;
