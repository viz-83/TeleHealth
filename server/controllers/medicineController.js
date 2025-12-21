const Medicine = require('../models/medicineModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

// Admin / Pharmacy Admin: Create Medicine
exports.createMedicine = catchAsync(async (req, res, next) => {
    const newMedicine = await Medicine.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            medicine: newMedicine
        }
    });
});

// Use existing APIFeatures for filtering, sorting, pagination
exports.getAllMedicines = catchAsync(async (req, res, next) => {
    // Basic filter: only Active medicines by default for public
    const filter = { isActive: true };

    // Allow searching by Name or Composition using Regex
    if (req.query.search) {
        const searchRegex = new RegExp(req.query.search, 'i');
        filter.$or = [
            { name: searchRegex },
            { composition: searchRegex },
            { brand: searchRegex }
        ];
    }

    // Create query with standard features
    const features = new APIFeatures(Medicine.find(filter), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    const medicines = await features.query;

    res.status(200).json({
        status: 'success',
        results: medicines.length,
        data: {
            medicines
        }
    });
});

exports.getMedicineById = catchAsync(async (req, res, next) => {
    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
        return next(new AppError('No medicine found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            medicine
        }
    });
});

exports.updateMedicine = catchAsync(async (req, res, next) => {
    const medicine = await Medicine.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!medicine) {
        return next(new AppError('No medicine found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            medicine
        }
    });
});

exports.deleteMedicine = catchAsync(async (req, res, next) => {
    // Soft delete usually preferred
    await Medicine.findByIdAndUpdate(req.params.id, { isActive: false });

    res.status(204).json({
        status: 'success',
        data: null
    });
});
