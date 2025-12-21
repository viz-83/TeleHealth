const express = require('express');
const medicineOrderController = require('../controllers/medicineOrderController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

// Medicine Order Routes
router.post('/', authController.restrictTo('patient'), medicineOrderController.createMedicineOrder);
router.get('/my', authController.restrictTo('patient'), medicineOrderController.getMyMedicineOrders);
router.get('/:id', medicineOrderController.getMedicineOrderById); // Shared by patient and admin

// Admin Routes (Pharmacy Dashboard)
router.get('/', authController.restrictTo('admin', 'pharmacy_admin'), medicineOrderController.getAllMedicineOrders);
router.patch('/:id/status', authController.restrictTo('admin', 'pharmacy_admin', 'delivery_agent'), medicineOrderController.updateOrderStatus);

module.exports = router;
