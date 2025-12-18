const express = require('express');
const doctorController = require('../controllers/doctorController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/me/profile', authController.protect, doctorController.createOrUpdateMyDoctorProfile);
router.get('/me', authController.protect, doctorController.getDoctorProfile);

router.get('/nearby', doctorController.getNearbyDoctors);
router.get('/:id/availability', doctorController.getDoctorAvailability);
router.post('/me/availability', authController.protect, doctorController.updateAvailability);

module.exports = router;
