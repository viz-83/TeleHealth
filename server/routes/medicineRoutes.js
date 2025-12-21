const express = require('express');
const medicineController = require('../controllers/medicineController');
const authController = require('../controllers/authController');

const router = express.Router();

// Public routes (Search/Browse)
router.get('/', medicineController.getAllMedicines);
router.get('/:id', medicineController.getMedicineById);

// Protected routes (Create/Update - Admin/PharmacyAdmin only)
router.use(authController.protect);
router.use(authController.restrictTo('admin', 'pharmacy_admin'));

router.post('/', medicineController.createMedicine);
router.patch('/:id', medicineController.updateMedicine);
router.delete('/:id', medicineController.deleteMedicine);

module.exports = router;
