const AmbulanceBooking = require('../models/ambulanceBookingModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.bookAmbulance = catchAsync(async (req, res, next) => {
    const { pickupLocation, contactNumber } = req.body;

    if (!pickupLocation || !contactNumber) {
        return next(new AppError('Please provide pickup location and contact number', 400));
    }

    // Simmons simulated dispatch logic
    // In a real app, this would find the nearest available ambulance
    const estimatedArrivalMinutes = Math.floor(Math.random() * 15) + 5; // 5-20 mins
    const estimatedArrivalTime = new Date(Date.now() + estimatedArrivalMinutes * 60000);

    const booking = await AmbulanceBooking.create({
        user: req.user._id,
        pickupLocation,
        contactNumber,
        status: 'DISPATCHED', // Auto-dispatch for simulation
        estimatedArrival: estimatedArrivalTime,
        ambulanceId: `AMB-${Math.floor(1000 + Math.random() * 9000)}`
    });

    res.status(201).json({
        status: 'success',
        data: {
            booking,
            message: `Ambulance dispatched! Arriving in approximately ${estimatedArrivalMinutes} minutes.`
        }
    });
});

exports.getMyBookings = catchAsync(async (req, res, next) => {
    const bookings = await AmbulanceBooking.find({ user: req.user._id }).sort('-createdAt');

    res.status(200).json({
        status: 'success',
        results: bookings.length,
        data: {
            bookings
        }
    });
});
