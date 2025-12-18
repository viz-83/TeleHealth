const Appointment = require('../models/appointmentModel');
const Doctor = require('../models/doctorModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.bookAppointment = catchAsync(async (req, res, next) => {
    const { doctorId, date, startTime, endTime } = req.body;

    // 1. Validate input
    if (!doctorId || !date || !startTime || !endTime) {
        return next(new AppError('Please provide doctorId, date, startTime, and endTime', 400));
    }

    // 2. Find doctor
    const doctor = await Doctor.findById(doctorId);
    if (!doctor || !doctor.isActive) {
        return next(new AppError('Doctor not found or inactive', 404));
    }

    // 3. Convert date to Date object (start of day)
    const appointmentDate = new Date(date);
    appointmentDate.setHours(0, 0, 0, 0);

    // 4. Check for conflicts
    const existingAppointment = await Appointment.findOne({
        doctor: doctorId,
        date: appointmentDate,
        $or: [
            {
                // New start time falls within existing appointment
                startTime: { $lt: endTime },
                endTime: { $gt: startTime }
            }
        ],
        status: { $ne: 'CANCELLED' }
    });

    if (existingAppointment) {
        return next(new AppError('Slot already booked', 400));
    }

    // 5. Create Appointment
    const newAppointment = await Appointment.create({
        patient: req.user._id,
        doctor: doctorId,
        date: appointmentDate,
        startTime,
        endTime
    });

    // 6. Generate Stream IDs
    newAppointment.callId = `call_${newAppointment._id}`;
    newAppointment.chatChannelId = `chat_${newAppointment._id}`;
    await newAppointment.save();

    res.status(201).json({
        status: 'success',
        data: {
            appointment: newAppointment
        }
    });
});

exports.getMyAppointments = catchAsync(async (req, res, next) => {
    let query = { patient: req.user._id };

    if (req.user.role === 'doctor') {
        const doctor = await Doctor.findOne({ user: req.user._id });
        if (doctor) {
            query = { doctor: doctor._id };
        } else {
            // If doctor profile not found, return empty list
            return res.status(200).json({
                status: 'success',
                results: 0,
                data: { appointments: [] }
            });
        }
    }

    const appointments = await Appointment.find(query)
        .populate({
            path: 'doctor',
            select: 'name specialization hospitalName location'
        })
        .populate({
            path: 'patient',
            select: 'name email'
        })
        .sort({ date: -1, startTime: -1 });

    res.status(200).json({
        status: 'success',
        results: appointments.length,
        data: {
            appointments
        }
    });
});

exports.completeAppointment = catchAsync(async (req, res, next) => {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
        return next(new AppError('Appointment not found', 404));
    }

    // Optional: Check if user is the doctor or admin
    // if (req.user.role !== 'doctor' && req.user.role !== 'admin') { ... }

    appointment.status = 'COMPLETED';

    // Set post-consult chat expiration (default 48 hours)
    const hours = process.env.POST_CONSULT_CHAT_HOURS || 48;
    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + parseInt(hours));
    appointment.postConsultChatExpiresAt = expirationDate;

    await appointment.save();

    res.status(200).json({
        status: 'success',
        data: {
            appointment
        }
    });
});

// Optional: Get appointments for a doctor (if the user is a doctor)
// exports.getDoctorAppointments = ...
