const express = require('express');
const router = express.Router();
const { verifyToken, authorizeAdmin, authorizeSatgas, authorizePelapor } = require('../middleware/authMiddleware');
const reportController = require('../controllers/reportController'); // Pastikan import ini benar

// Routes untuk pelapor
router.post('/', verifyToken, reportController.createReport);
router.get('/', verifyToken, reportController.getUserReports);  // Menggunakan reportController.getUserReports
router.put('/:id', verifyToken, reportController.updateReport);
router.delete('/:id', verifyToken, reportController.deleteReport);

// ✅ Pelapor hanya bisa melihat laporan yang dia buat sendiri
router.get('/user/reports', [verifyToken, authorizePelapor], reportController.getUserReports); // Perbaiki dengan memanggil reportController.getUserReports

// Routes untuk Satgas
router.get('/all', authorizeSatgas, reportController.getAllReports);
router.get('/:id', authorizeSatgas, reportController.getReportById);
router.put('/:id/process', authorizeSatgas, reportController.processReport);

// ✅ Admin & Satgas bisa melihat semua laporan
router.get('/', verifyToken, reportController.getAllReports);

module.exports = router;
