const express = require('express');
const reportController = require('../controllers/reportController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.post('/upload', reportController.uploadMiddleware, reportController.uploadLabReport);
router.get('/my', reportController.getMyReports);
router.get('/patient/:patientId', authController.restrictTo('doctor'), reportController.getPatientReports);
router.get('/download/:id', reportController.downloadReport);

module.exports = router;
