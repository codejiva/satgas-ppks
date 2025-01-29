const express = require('express');
const router = express.Router();
const { createSatgas, editSatgas, deleteSatgas } = require('../controllers/userController');
const { authorizeAdmin } = require('../middleware/authMiddleware');

// CRUD akun Satgas (hanya bisa dilakukan oleh admin)
router.post('/satgas', authorizeAdmin, createSatgas);
router.put('/satgas/:id', authorizeAdmin, editSatgas);
router.delete('/satgas/:id', authorizeAdmin, deleteSatgas);

module.exports = router;
