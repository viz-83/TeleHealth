const express = require('express');
const diagnosticTestController = require('../controllers/diagnosticTestController');
const authController = require('../controllers/authController');

const router = express.Router();

// Public routes
router.get('/', diagnosticTestController.getAllTests);
router.get('/:id', diagnosticTestController.getTestById);

// Protected routes (Admin only)
router.use(authController.protect);
router.use(authController.restrictTo('admin', 'lab_admin'));

router.post('/', diagnosticTestController.createTest);

module.exports = router;
