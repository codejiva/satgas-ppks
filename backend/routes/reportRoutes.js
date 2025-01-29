const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { createReport, getReports, updateReport, deleteReport } = require('../controllers/reportController');

// Routes
router.post('/', verifyToken, createReport);
router.get('/', verifyToken, getReports);
router.put('/:id', verifyToken, updateReport);
router.delete('/:id', verifyToken, deleteReport);

module.exports = router;
