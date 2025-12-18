const mongoose = require('mongoose');

const medicalEntrySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    dosage: {
        type: String,
        required: true
    },
    frequency: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    }
});

const prescriptionSchema = new mongoose.Schema({
    appointment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
        required: [true, 'Prescription must belong to an appointment']
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Prescription must belong to a doctor']
    },
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Prescription must belong to a patient']
    },
    diagnosis: {
        type: String,
        required: [true, 'Diagnosis is required']
    },
    medicines: [medicalEntrySchema],
    tests: [String],
    advice: String,
    nextVisit: Date,
    pdfUrl: String,
    pdfData: {
        type: Buffer,
        select: false // Do not return by default to avoid large payloads
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Prescription', prescriptionSchema);
