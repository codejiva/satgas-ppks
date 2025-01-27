const express = require('express');
const router = express.Router();
const { createSatgas, editSatgas, deleteSatgas } = require('../controllers/userController');
const { authorizeAdmin } = require('../middleware/authMiddleware');

// CRUD akun satgas cuma bisa dilakukan oleh ADMIN. jangan macam-macam kamu yhhh

// create
router.post('/users/satgas', authorizeAdmin, createSatgas);

// edit
router.put('/users/satgas/:id', authorizeAdmin, editSatgas);

// hapus
router.delete('/users/satgas/:id', authorizeAdmin, deleteSatgas);

module.exports = router;
