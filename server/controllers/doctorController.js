const Doctor = require('../models/doctorModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.createDoctor = catchAsync(async (req, res, next) => {
    const {
        name,
        specialization,
        hospitalName,
        city,
        state,
        pincode,
        fullAddress,
        coordinates, // { lat, lng }
        availabilitySlots
    } = req.body;

    // Construct the location object
    const location = {
        city,
        state,
        pincode,
        fullAddress,
        coordinates: {
            type: 'Point',
            coordinates: [coordinates.lng, coordinates.lat] // GeoJSON expects [lng, lat]
        }
    };

    const newDoctor = await Doctor.create({
        name,
        specialization,
        hospitalName,
        location,
        availabilitySlots
    });

    res.status(201).json({
        status: 'success',
        data: {
            doctor: newDoctor
        }
    });
});

exports.getNearbyDoctors = catchAsync(async (req, res, next) => {
    const { lat, lng, city, specialization } = req.query;

    let query = {};

    if (lat && lng) {
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lng);
        const radius = 20 / 6378.1; // 20km radius in radians

        query['location.coordinates'] = {
            $geoWithin: {
                $centerSphere: [[longitude, latitude], radius]
            }
        };
    } else if (city) {
        query['location.city'] = { $regex: new RegExp(city, 'i') }; // Case-insensitive
    } else {
        return next(new AppError('Please provide either latitude/longitude or city to find doctors.', 400));
    }

    if (specialization) {
        query.specialization = { $regex: new RegExp(specialization, 'i') };
    }

    const doctors = await Doctor.find(query);

    res.status(200).json({
        status: 'success',
        results: doctors.length,
        data: {
            doctors
        }
    });
});

const Appointment = require('../models/appointmentModel');

// Helper to generate 30-minute slots from a range
const generateSlots = (start, end) => {
    const slots = [];
    let current = new Date(`2000-01-01T${start}`);
    const endTime = new Date(`2000-01-01T${end}`);

    while (current < endTime) {
        const slotStart = current.toTimeString().slice(0, 5);
        current.setMinutes(current.getMinutes() + 30);
        const slotEnd = current.toTimeString().slice(0, 5);
        slots.push({ startTime: slotStart, endTime: slotEnd });
    }
    return slots;
};

exports.getDoctorAvailability = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { date } = req.query; // YYYY-MM-DD

    if (!date) {
        return next(new AppError('Please provide a date (YYYY-MM-DD) to check availability.', 400));
    }

    const doctor = await Doctor.findById(id);
    if (!doctor) {
        return next(new AppError('No doctor found with that ID', 404));
    }

    // 1. Get day of week (0-6)
    const queryDate = new Date(date);
    const dayOfWeek = queryDate.getDay();

    // 2. Get doctor's availability for that day
    const daySlots = doctor.availabilitySlots.filter(slot => slot.dayOfWeek === dayOfWeek);

    // 3. Get existing bookings for that doctor on that date
    // We need to match the date part exactly. 
    // Since we store date as Date object at 00:00:00, we can match directly if we ensure queryDate is also 00:00:00
    queryDate.setHours(0, 0, 0, 0);

    const bookings = await Appointment.find({
        doctor: id,
        date: queryDate,
        status: 'BOOKED'
    });

    // 4. Generate 30-min slots and check availability
    let allSlots = [];
    daySlots.forEach(slot => {
        const chunks = generateSlots(slot.startTime, slot.endTime);
        allSlots = [...allSlots, ...chunks];
    });

    const finalSlots = allSlots.map(slot => {
        const isBooked = bookings.some(booking => {
            // Check for overlap
            // Slot: [start, end)
            // Booking: [start, end)
            // Overlap if: slotStart < bookingEnd AND slotEnd > bookingStart
            return slot.startTime < booking.endTime && slot.endTime > booking.startTime;
        });

        return {
            ...slot,
            isBooked
        };
    });

    res.status(200).json({
        status: 'success',
        data: {
            date,
            dayOfWeek,
            slots: finalSlots
        }
    });
});
