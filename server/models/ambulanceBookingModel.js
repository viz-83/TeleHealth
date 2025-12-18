const mongoose = require('mongoose');

const ambulanceBookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Booking must belong to a user']
    },
    pickupLocation: {
        type: String,
        required: [true, 'Please provide pickup location']
    },
    contactNumber: {
        type: String,
        required: [true, 'Please provide a contact number']
    },
    status: {
        type: String,
        enum: ['PENDING', 'DISPATCHED', 'COMPLETED', 'CANCELLED'],
        default: 'PENDING'
    },
    ambulanceId: {
        type: String,
        default: null // In a real app, this would link to an Ambulance model
    },
    estimatedArrival: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const AmbulanceBooking = mongoose.model('AmbulanceBooking', ambulanceBookingSchema);

module.exports = AmbulanceBooking;
