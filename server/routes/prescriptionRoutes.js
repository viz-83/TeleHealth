const express = require('express');
const prescriptionController = require('../controllers/prescriptionController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.post('/', prescriptionController.createPrescription);
router.get('/my', prescriptionController.getMyPrescriptions);
router.get('/download/:id', prescriptionController.downloadPrescription);
router.get('/:appointmentId', prescriptionController.getPrescriptionForAppointment);

module.exports = router;
