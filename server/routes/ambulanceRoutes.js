const express = require('express');
const ambulanceController = require('../controllers/ambulanceController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect); // All routes protected

router.post('/book', ambulanceController.bookAmbulance);
router.get('/my', ambulanceController.getMyBookings);

module.exports = router;
