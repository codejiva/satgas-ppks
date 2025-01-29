const express = require('express');
const router = express.Router();
const { verifyToken, authorizeSatgas } = require('../middleware/authMiddleware');
const reportController = require('../controllers/reportController'); // Pastikan import ini benar

// Routes untuk pelapor
router.post('/', verifyToken, reportController.createReport);
router.get('/', verifyToken, reportController.getUserReports);
router.put('/:id', verifyToken, reportController.updateReport);
router.delete('/:id', verifyToken, reportController.deleteReport);

// Routes untuk Satgas
router.get('/all', authorizeSatgas, reportController.getAllReports);
router.get('/:id', authorizeSatgas, reportController.getReportById);
router.put('/:id/process', authorizeSatgas, reportController.processReport);

module.exports = router;
