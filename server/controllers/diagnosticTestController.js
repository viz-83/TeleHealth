const DiagnosticTest = require('../models/diagnosticTestModel');
const AppError = require('../utils/appError');

exports.createTest = async (req, res, next) => {
    try {
        const newTest = await DiagnosticTest.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                test: newTest
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.getAllTests = async (req, res, next) => {
    try {
        const queryObj = { ...req.query, isActive: true };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);

        // Advanced filtering (optional, can expand later)
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        const tests = await DiagnosticTest.find(JSON.parse(queryStr));

        res.status(200).json({
            status: 'success',
            results: tests.length,
            data: {
                tests
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.getTestById = async (req, res, next) => {
    try {
        const test = await DiagnosticTest.findById(req.params.id);

        if (!test) {
            return next(new AppError('No test found with that ID', 404));
        }

        res.status(200).json({
            status: 'success',
            data: {
                test
            }
        });
    } catch (err) {
        next(err);
    }
};
