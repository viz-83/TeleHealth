const express = require('express');
const diagnosticOrderController = require('../controllers/diagnosticOrderController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.post('/', authController.restrictTo('patient'), diagnosticOrderController.createDiagnosticOrder);
router.get('/my', authController.restrictTo('patient'), diagnosticOrderController.getMyDiagnosticOrders);

// Field worker routes
router.get('/assigned', authController.restrictTo('field_worker'), diagnosticOrderController.getAssignedOrders);

router.get('/:id', diagnosticOrderController.getOrderById);

router.patch('/:id/status', authController.restrictTo('field_worker', 'admin', 'lab_admin'), diagnosticOrderController.updateOrderStatus);

module.exports = router;
