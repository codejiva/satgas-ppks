const express = require('express');
const router = express.Router();
const { createSatgas, editSatgas, deleteSatgas } = require('../controllers/userController');
const { authorizeAdmin } = require('../middleware/authMiddleware');

// Admin
// CRUD akun satgas cuma bisa dilakukan oleh ADMIN. jangan macam-macam kamu yhhh
router.post('/users/satgas', authorizeAdmin, createSatgas);
router.put('/users/satgas/:id', authorizeAdmin, editSatgas);
router.delete('/users/satgas/:id', authorizeAdmin, deleteSatgas);

module.exports = router;
