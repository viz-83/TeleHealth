const express = require('express');
const streamController = require('../controllers/streamController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/token-v2', authController.protect, streamController.getAppointmentToken);

// Restore original endpoint for backward compatibility
router.post('/token', authController.protect, streamController.getAppointmentToken);

router.post('/user-token', authController.protect, streamController.getUserToken);

module.exports = router;
