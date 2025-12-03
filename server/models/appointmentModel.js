const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'An appointment must belong to a patient']
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: [true, 'An appointment must belong to a doctor']
    },
    date: {
        type: Date,
        required: [true, 'An appointment must have a date']
    },
    startTime: {
        type: String, // Format: "HH:mm"
        required: [true, 'An appointment must have a start time']
    },
    endTime: {
        type: String, // Format: "HH:mm"
        required: [true, 'An appointment must have an end time']
    },
    status: {
        type: String,
        enum: ['BOOKED', 'IN_WAITING_ROOM', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
        default: 'BOOKED'
    },
    callId: {
        type: String
    },
    chatChannelId: {
        type: String
    },
    postConsultChatExpiresAt: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Prevent duplicate bookings for the same doctor at the same time
appointmentSchema.index({ doctor: 1, date: 1, startTime: 1 }, { unique: true });

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
