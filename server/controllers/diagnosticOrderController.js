const DiagnosticOrder = require('../models/diagnosticOrderModel');
const DiagnosticTest = require('../models/diagnosticTestModel');
const AppError = require('../utils/appError');

exports.createDiagnosticOrder = async (req, res, next) => {
    try {
        const { testIds, collectionAddress, preferredSlot } = req.body;

        if (!testIds || testIds.length === 0) {
            return next(new AppError('Please provide at least one test to book.', 400));
        }

        // Fetch tests to ensure valid IDs and calculate price securely server-side
        const tests = await DiagnosticTest.find({ _id: { $in: testIds } });

        if (tests.length !== testIds.length) {
            return next(new AppError('Some selected tests are invalid or no longer available.', 400));
        }

        const orderTests = tests.map(test => ({
            test: test._id,
            price: test.price
        }));

        const totalAmount = orderTests.reduce((sum, item) => sum + item.price, 0);

        const newOrder = await DiagnosticOrder.create({
            patient: req.user.id,
            tests: orderTests,
            totalAmount,
            collectionAddress,
            preferredSlot,
            status: 'BOOKED'
        });

        res.status(201).json({
            status: 'success',
            data: {
                order: newOrder
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.getMyDiagnosticOrders = async (req, res, next) => {
    try {
        const orders = await DiagnosticOrder.find({ patient: req.user.id }).sort({ createdAt: -1 });

        res.status(200).json({
            status: 'success',
            results: orders.length,
            data: {
                orders
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.getOrderById = async (req, res, next) => {
    try {
        const order = await DiagnosticOrder.findById(req.params.id);

        if (!order) {
            return next(new AppError('No order found with that ID', 404));
        }

        // Access control: Patient, Assigned Collector, or Admin
        const isPatient = order.patient._id.toString() === req.user.id;
        const isCollector = order.assignedCollector && order.assignedCollector._id.toString() === req.user.id;
        const isAdmin = req.user.role === 'admin' || req.user.role === 'lab_admin';

        if (!isPatient && !isCollector && !isAdmin) {
            return next(new AppError('You do not have permission to view this order', 403));
        }

        res.status(200).json({
            status: 'success',
            data: {
                order
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.updateOrderStatus = async (req, res, next) => {
    try {
        const { status, reportUrls } = req.body;
        const order = await DiagnosticOrder.findById(req.params.id);

        if (!order) {
            return next(new AppError('No order found with that ID', 404));
        }

        // Logic for Field Worker: Can only mark as SAMPLE_COLLECTED
        if (req.user.role === 'field_worker' && status === 'SAMPLE_COLLECTED') {
            // In a real app, ensure this worker is assigned to this order
            order.status = status;
        }
        // Logic for Admin/Lab: Can mark IN_LAB or REPORT_READY
        else if (['admin', 'lab_admin'].includes(req.user.role)) {
            order.status = status;
            if (status === 'REPORT_READY' && reportUrls) {
                order.reportUrls = reportUrls;
            }
        } else {
            return next(new AppError('You are not authorized to perform this action', 403));
        }

        await order.save();

        res.status(200).json({
            status: 'success',
            data: {
                order
            }
        });
    } catch (err) {
        next(err);
    }
};

// For Field Workers to see their tasks
exports.getAssignedOrders = async (req, res, next) => {
    try {
        // In this implementation, we might just query all BOOKED orders or assign them manually.
        // For simplicity, let's assume field workers can see all BOOKED orders in their area, 
        // OR primarily orders assigned to them.

        let query = { assignedCollector: req.user.id };

        // If no strict assignment system, maybe they see all 'BOOKED' orders to pick them up?
        // Let's stick to the prompt requirement: "View assigned collections"

        const orders = await DiagnosticOrder.find(query).sort({ 'preferredSlot.date': 1 });

        res.status(200).json({
            status: 'success',
            results: orders.length,
            data: {
                orders
            }
        });
    } catch (err) {
        next(err);
    }
};
