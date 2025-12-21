const MedicineOrder = require('../models/medicineOrderModel');
const Medicine = require('../models/medicineModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.createMedicineOrder = catchAsync(async (req, res, next) => {
    const { medicineItems, deliveryAddress, prescriptionId } = req.body; // prescriptionId or URL

    if (!medicineItems || medicineItems.length === 0) {
        return next(new AppError('Order must contain medicines', 400));
    }

    // 1. Fetch all medicines and validate stock
    const medicinesToOrder = [];
    let calculatedTotal = 0;
    let requiresPrescription = false;

    // Use loop to validate async properly
    for (const item of medicineItems) {
        const medicine = await Medicine.findById(item.medicineId);

        if (!medicine || !medicine.isActive) {
            return next(new AppError(`Medicine not found or inactive: ${item.medicineId}`, 404));
        }

        if (medicine.stockQuantity < item.quantity) {
            return next(new AppError(`Insufficient stock for ${medicine.name}. Available: ${medicine.stockQuantity}`, 400));
        }

        // Check prescription requirement
        if (medicine.prescriptionRequired) {
            requiresPrescription = true;
        }

        calculatedTotal += medicine.price * item.quantity;

        medicinesToOrder.push({
            medicine: medicine._id,
            name: medicine.name,
            quantity: item.quantity,
            priceAtPurchase: medicine.price
        });
    }

    // 2. Determine Initial Status
    let initialStatus = "PLACED";

    // If ANY med requires prescription 
    if (requiresPrescription) {
        // If user didn't provide a prescription URL/ID, mark as PENDING verify.
        // Even if they DID provide it, usually we still mark as PENDING/VERIFY to manually check it.
        // Assuming workflow: Upload -> Pending -> Admin Verify -> Placed/Packed
        initialStatus = "PRESCRIPTION_PENDING";
    }

    // 3. Create Order
    const newOrder = await MedicineOrder.create({
        patient: req.user.id,
        medicines: medicinesToOrder,
        totalAmount: calculatedTotal,
        deliveryAddress: deliveryAddress,
        prescription: prescriptionId || null, // URL or ID
        status: initialStatus,
        statusHistory: [{
            status: initialStatus,
            changedBy: req.user.id,
            note: 'Order created'
        }]
    });

    // 4. Reduce Stock (Only if we consider stock reserved immediately, usually yes)
    // Note: Concurrency issues ignored for MVP, use transactions in production
    for (const item of medicineItems) {
        await Medicine.findByIdAndUpdate(item.medicineId, {
            $inc: { stockQuantity: -item.quantity }
        });
    }

    res.status(201).json({
        status: 'success',
        data: {
            order: newOrder
        }
    });
});

exports.getMyMedicineOrders = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(MedicineOrder.find({ patient: req.user.id }), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    const orders = await features.query;

    res.status(200).json({
        status: 'success',
        results: orders.length,
        data: {
            orders
        }
    });
});

exports.getMedicineOrderById = catchAsync(async (req, res, next) => {
    const order = await MedicineOrder.findById(req.params.id);

    if (!order) {
        return next(new AppError('No order found with that ID', 404));
    }

    // Access Control
    if (req.user.role === 'patient' && order.patient._id.toString() !== req.user.id) {
        return next(new AppError('You update not have permission to view this order', 403));
    }

    res.status(200).json({
        status: 'success',
        data: {
            order
        }
    });
});

// Admin / Pharmacy Admin update status
exports.updateOrderStatus = catchAsync(async (req, res, next) => {
    const { status } = req.body;

    const order = await MedicineOrder.findById(req.params.id);
    if (!order) {
        return next(new AppError('No order found with that ID', 404));
    }

    order.status = status;
    order.statusHistory.push({
        status: status,
        changedBy: req.user.id,
        note: req.body.note || 'Status updated'
    });

    await order.save();

    res.status(200).json({
        status: 'success',
        data: {
            order
        }
    });
});

// Admin view all orders (for Pharmacy Dashboard)
exports.getAllMedicineOrders = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(MedicineOrder.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    const orders = await features.query;

    res.status(200).json({
        status: 'success',
        results: orders.length,
        data: {
            orders
        }
    });
});
