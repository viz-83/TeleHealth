const mongoose = require('mongoose');

const diagnosticOrderSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Order must belong to a patient']
    },
    tests: [{
        test: {
            type: mongoose.Schema.ObjectId,
            ref: 'DiagnosticTest',
            required: true
        },
        price: {
            type: Number,
            required: true
        }
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    collectionAddress: {
        fullAddress: {
            type: String,
            required: [true, 'Collection address is required']
        },
        city: {
            type: String,
            required: [true, 'City is required']
        },
        pincode: {
            type: String,
            required: [true, 'Pincode is required']
        }
    },
    preferredSlot: {
        date: {
            type: Date,
            required: [true, 'Preferred collection date is required']
        },
        timeRange: {
            type: String,
            required: [true, 'Preferred time slot is required']
        }
    },
    status: {
        type: String,
        enum: ['BOOKED', 'SAMPLE_COLLECTED', 'IN_LAB', 'REPORT_READY', 'CANCELLED'],
        default: 'BOOKED'
    },
    assignedCollector: {
        type: mongoose.Schema.ObjectId,
        ref: 'User' // Role: FIELD_WORKER
    },
    reportUrls: [String],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

diagnosticOrderSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'tests.test',
        select: 'name category'
    }).populate({
        path: 'patient',
        select: 'name email'
    }).populate({
        path: 'assignedCollector',
        select: 'name mobile'
    });
    next();
});

const DiagnosticOrder = mongoose.model('DiagnosticOrder', diagnosticOrderSchema);

module.exports = DiagnosticOrder;
