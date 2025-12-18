const Prescription = require('../models/prescriptionModel');
const Appointment = require('../models/appointmentModel');
const User = require('../models/User');
const Doctor = require('../models/doctorModel');
const catchAsync = require('../utils/catchAsync'); // Assuming this exists based on open files
const AppError = require('../utils/appError');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

exports.createPrescription = catchAsync(async (req, res, next) => {
    const { appointmentId, diagnosis, medicines, tests, advice, nextVisit } = req.body;
    console.log('[CreatePrescription] Body:', JSON.stringify(req.body, null, 2));
    console.log(`[CreatePrescription] Medicines: ${medicines ? medicines.length : 0} items. Type: ${typeof medicines}`);

    // 1. Verify Appointment matches Doctor
    const appointment = await Appointment.findById(appointmentId).populate('patient');
    if (!appointment) {
        return next(new AppError('Appointment not found', 404));
    }

    // Check if the current user is the doctor for this appointment
    const doctorProfile = await Doctor.findOne({ user: req.user._id });
    if (!doctorProfile || appointment.doctor.toString() !== doctorProfile._id.toString()) {
        return next(new AppError('You are not authorized to prescribe for this appointment', 403));
    }

    // 2. Generate PDF in Memory
    const doc = new PDFDocument();
    let buffers = [];
    doc.on('data', buffers.push.bind(buffers));

    // -- PDF Content --
    // Header
    doc.fontSize(20).text(`Prescription from Dr. ${doctorProfile.name}`, { align: 'center' });
    doc.fontSize(12).text(`${doctorProfile.hospitalName}`, { align: 'center' });
    doc.text(`${doctorProfile.location.fullAddress}`, { align: 'center' });
    doc.moveDown();

    // Patient & Date
    doc.text(`Patient Name: ${appointment.patient.name}`);
    doc.text(`Date: ${new Date().toLocaleDateString()}`);
    if (nextVisit) {
        doc.text(`Next Visit: ${new Date(nextVisit).toLocaleDateString()}`);
    }
    doc.moveDown();
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke(); // Horizontal Line
    doc.moveDown();

    // Diagnosis
    doc.fontSize(14).text('Diagnosis:', { underline: true });
    doc.fontSize(12).text(diagnosis);
    doc.moveDown();

    // Medicines
    // Ensure medicines is an array. If parsed from JSON string over network, purely relying on body-parser which handles JSON.
    if (medicines && Array.isArray(medicines) && medicines.length > 0) {
        doc.fontSize(14).text('Medicines:', { underline: true });
        medicines.forEach((med, i) => {
            const line = `${i + 1}. ${med.name} - ${med.dosage} (${med.frequency}) for ${med.duration}`;
            doc.fontSize(12).text(line);
        });
        doc.moveDown();
    } else {
        console.log('[CreatePrescription] Medicines array is empty or invalid:', medicines);
    }

    // Tests
    if (tests && Array.isArray(tests) && tests.length > 0) {
        doc.fontSize(14).text('Recommended Tests:', { underline: true });
        tests.forEach((test, i) => {
            doc.fontSize(12).text(`${i + 1}. ${test}`);
        });
        doc.moveDown();
    }

    // Advice
    if (advice) {
        doc.fontSize(14).text('Advice:', { underline: true });
        doc.fontSize(12).text(advice);
    }

    // Finalize PDF
    doc.end();

    // Wait for the stream to finish and collect buffer
    const pdfBuffer = await new Promise((resolve) => {
        doc.on('end', () => {
            const data = Buffer.concat(buffers);
            resolve(data);
        });
    });

    // 3. Save to DB
    const prescription = await Prescription.create({
        appointment: appointmentId,
        doctor: req.user._id, // User ID of doctor
        patient: appointment.patient._id,
        diagnosis,
        medicines,
        tests,
        advice,
        nextVisit,
        pdfData: pdfBuffer,
        // pdfUrl will be set after ID generation mostly, or we construct it now
        // We can't know _id before creation unless we generate it manually, but Mongoose does it.
        // We will update pdfUrl momentarily or just construct it:
        // Actually, let's create it first, then update pdfUrl to point to our download route
    });

    prescription.pdfUrl = `/api/v1/prescriptions/download/${prescription._id}`;
    await prescription.save({ validateBeforeSave: false });

    // Return response (exclude pdfData)
    prescription.pdfData = undefined;

    res.status(201).json({
        status: 'success',
        data: {
            prescription
        }
    });
});

exports.downloadPrescription = catchAsync(async (req, res, next) => {
    const prescription = await Prescription.findById(req.params.id).select('+pdfData');

    if (!prescription) {
        return next(new AppError('Prescription not found', 404));
    }

    // Access control
    const isPatient = prescription.patient.toString() === req.user._id.toString();
    const isDoctor = prescription.doctor.toString() === req.user._id.toString();

    if (!isPatient && !isDoctor) {
        return next(new AppError('Not authorized', 403));
    }

    if (!prescription.pdfData) {
        return next(new AppError('PDF data not found', 404));
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="prescription-${prescription._id}.pdf"`);
    res.send(prescription.pdfData);
});

exports.getMyPrescriptions = catchAsync(async (req, res, next) => {
    let query = {};
    if (req.user.role === 'doctor') {
        query = { doctor: req.user._id };
    } else {
        query = { patient: req.user._id };
    }

    const prescriptions = await Prescription.find(query)
        .populate({
            path: 'doctor',
            select: 'name'
        })
        .populate({
            path: 'patient',
            select: 'name email'
        })
        .populate({
            path: 'appointment',
            select: 'date startTime'
        })
        .sort('-createdAt');

    res.status(200).json({
        status: 'success',
        results: prescriptions.length,
        data: {
            prescriptions
        }
    });
});

exports.getPrescriptionForAppointment = catchAsync(async (req, res, next) => {
    const prescription = await Prescription.findOne({ appointment: req.params.appointmentId })
        .populate('doctor', 'name')
        .populate('patient', 'name email')
        .populate('appointment');

    if (!prescription) {
        return next(new AppError('No prescription found for this appointment', 404));
    }

    // Access control: only doctor or patient of this appointment
    // Note: patient is NOT populated, so it's an ID. doctor IS populated, so it's an object.
    const patientId = prescription.patient ? prescription.patient.toString() : null;
    const doctorId = prescription.doctor ? prescription.doctor._id.toString() : null;
    const currentUserId = req.user._id.toString();

    console.log(`[Auth Check] Prescription ${prescription._id}`);
    console.log(`[Auth Check] Patient: ${patientId} | Doctor: ${doctorId} | Current: ${currentUserId}`);

    const isPatient = patientId === currentUserId;
    const isDoctor = doctorId === currentUserId;

    if (!isPatient && !isDoctor) {
        console.log('[Auth Check] FAILED');
        // Technically strict check would be checking logged in user vs prescription roles
        // but this is decent.
        return next(new AppError('Not authorized to view this prescription', 403));
    }

    res.status(200).json({
        status: 'success',
        data: {
            prescription
        }
    });
});
