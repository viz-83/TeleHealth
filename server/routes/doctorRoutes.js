const express = require('express');
const doctorController = require('../controllers/doctorController');

const router = express.Router();

router.post('/', doctorController.createDoctor);
router.get('/nearby', doctorController.getNearbyDoctors);
router.get('/:id/availability', doctorController.getDoctorAvailability);

module.exports = router;
