const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

// Endpoint untuk mengambil semua janji temu
router.get('/', appointmentController.getAllAppointments);

// Endpoint untuk membuat janji temu baru
router.post('/', appointmentController.createAppointment);

// Endpoint untuk mengubah jadwal janji temu
router.put('/:id', appointmentController.updateAppointment);

// Endpoint untuk menghapus janji temu
router.delete('/:id', appointmentController.deleteAppointment);

module.exports = router;
