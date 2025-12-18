const Doctor = require('../models/doctorModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.createOrUpdateMyDoctorProfile = catchAsync(async (req, res, next) => {
    const {
        specialization,
        hospitalName,
        city,
        state,
        pincode,
        fullAddress,
        coordinates, // { lat, lng }
        availabilitySlots
    } = req.body;

    console.log('--- Profile Update Debug ---');
    console.log('Req Body Availability:', availabilitySlots);

    // Construct the location object
    const location = {
        city,
        state,
        pincode,
        fullAddress,
    };

    if (coordinates && coordinates.lat && coordinates.lng) {
        location.coordinates = {
            type: 'Point',
            coordinates: [coordinates.lng, coordinates.lat]
        };
    }

    const doctorData = {
        user: req.user._id,
        name: req.user.name, // Use name from User account
        specialization,
        hospitalName,
        location,
        availabilitySlots: availabilitySlots || [
            { dayOfWeek: 1, startTime: '09:00', endTime: '17:00' }, // Monday
            { dayOfWeek: 2, startTime: '09:00', endTime: '17:00' }, // Tuesday
            { dayOfWeek: 3, startTime: '09:00', endTime: '17:00' }, // Wednesday
            { dayOfWeek: 4, startTime: '09:00', endTime: '17:00' }, // Thursday
            { dayOfWeek: 5, startTime: '09:00', endTime: '17:00' }  // Friday
        ]
    };

    console.log('Doctor Data to Save (Slots):', JSON.stringify(doctorData.availabilitySlots));

    // Check if doctor profile exists for this user
    let doctor = await Doctor.findOne({ user: req.user._id });

    if (doctor) {
        // Update existing
        doctor = await Doctor.findByIdAndUpdate(doctor._id, doctorData, {
            new: true,
            runValidators: true
        });
    } else {
        // Create new
        doctor = await Doctor.create(doctorData);
    }

    res.status(200).json({
        status: 'success',
        data: {
            doctor
        }
    });
});

// Keep createDoctor for admin/seeding if needed, or deprecate it. 
// For now, I'll leave the old createDoctor as a separate admin function if you want, 
// but the user request asked to implement the profile creation. 
// I will add the new function and keep the old one renamed or just replace it if it was only for testing.
// The user said "Add a new controller function", so I will append it.


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

    console.log('--- Availability Debug ---');
    console.log('Query Date:', date);
    console.log('Parsed Date:', queryDate);
    console.log('Day of Week:', dayOfWeek);
    console.log('Doctor Slots:', JSON.stringify(doctor.availabilitySlots));

    // 2. Get doctor's availability for that day
    const daySlots = doctor.availabilitySlots.filter(slot => slot.dayOfWeek === dayOfWeek);
    console.log('Day Slots Found:', daySlots);

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

exports.getDoctorProfile = catchAsync(async (req, res, next) => {
    const doctor = await Doctor.findOne({ user: req.user._id });

    if (!doctor) {
        return next(new AppError('No doctor profile found for this user.', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            doctor
        }
    });
});

exports.updateAvailability = catchAsync(async (req, res, next) => {
    const { availabilitySlots } = req.body;

    if (!availabilitySlots || !Array.isArray(availabilitySlots)) {
        return next(new AppError('Please provide a valid array of availability slots.', 400));
    }

    // Validate slots structure (basic check)
    const isValid = availabilitySlots.every(slot =>
        slot.dayOfWeek >= 0 && slot.dayOfWeek <= 6 &&
        slot.startTime &&
        slot.endTime
    );

    if (!isValid) {
        return next(new AppError('Invalid slot format. Each slot must have dayOfWeek (0-6), startTime, and endTime.', 400));
    }

    const doctor = await Doctor.findOneAndUpdate(
        { user: req.user._id },
        { availabilitySlots },
        { new: true, runValidators: true }
    );

    if (!doctor) {
        return next(new AppError('No doctor profile found for this user.', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            doctor
        }
    });
});
