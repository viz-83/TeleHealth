const Report = require('../models/reportModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const multer = require('multer');

// Configure Multer for Memory Storage
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

exports.uploadMiddleware = upload.single('file');

exports.uploadLabReport = catchAsync(async (req, res, next) => {
    if (!req.file) {
        return next(new AppError('Please provide a file', 400));
    }

    const { appointmentId } = req.body;

    const newReport = await Report.create({
        patient: req.user._id,
        appointment: appointmentId || undefined,
        fileName: req.file.originalname,
        fileType: req.file.mimetype,
        fileData: req.file.buffer
    });

    res.status(201).json({
        status: 'success',
        data: {
            report: {
                _id: newReport._id,
                fileName: newReport.fileName,
                fileType: newReport.fileType,
                uploadedAt: newReport.uploadedAt,
                appointment: newReport.appointment
            }
        }
    });
});

exports.getMyReports = catchAsync(async (req, res, next) => {
    const reports = await Report.find({ patient: req.user._id })
        .sort('-uploadedAt')
        .select('-fileData'); // explicit exclude just in case

    res.status(200).json({
        status: 'success',
        results: reports.length,
        data: {
            reports
        }
    });
});

exports.getPatientReports = catchAsync(async (req, res, next) => {
    // Only doctors should access this (middleware check in routes)
    const reports = await Report.find({ patient: req.params.patientId })
        .sort('-uploadedAt')
        .select('-fileData');

    res.status(200).json({
        status: 'success',
        results: reports.length,
        data: {
            reports
        }
    });
});

exports.downloadReport = catchAsync(async (req, res, next) => {
    const report = await Report.findById(req.params.id).select('+fileData');

    if (!report) {
        return next(new AppError('Report not found', 404));
    }

    // Access Control: Patient or Doctor (we can refine doctor check if needed)
    // For simplicity, if user is the patient OR user is a doctor
    const isOwner = report.patient.toString() === req.user._id.toString();
    const isDoctor = req.user.role === 'doctor';

    if (!isOwner && !isDoctor) {
        return next(new AppError('Not authorized to view this report', 403));
    }

    res.setHeader('Content-Type', report.fileType);
    res.setHeader('Content-Disposition', `inline; filename="${report.fileName}"`);
    res.send(report.fileData);
});
