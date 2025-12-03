const express = require('express');
const appointmentController = require('../controllers/appointmentController');
const authController = require('../controllers/authController');

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);

router.post('/', appointmentController.bookAppointment);
router.get('/my', appointmentController.getMyAppointments);
router.patch('/:id/complete', appointmentController.completeAppointment);

module.exports = router;
