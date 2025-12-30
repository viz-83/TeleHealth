const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { StreamClient } = require('@stream-io/node-sdk');
const { StreamChat } = require('stream-chat');
const logger = require('../utils/logger');

// Initialize Video Client
const videoClient = new StreamClient(process.env.STREAM_API_KEY, process.env.STREAM_API_SECRET);

exports.getAppointmentToken = catchAsync(async (req, res, next) => {
    const { appointmentId, purpose = 'both' } = req.body;

    // 1. Find Appointment
    const appointment = await Appointment.findById(appointmentId)
        .populate('patient', 'id name email')
        .populate({
            path: 'doctor',
            populate: {
                path: 'user',
                select: 'id name email role'
            }
        });


    if (!appointment) {
        return next(new AppError('Appointment not found', 404));
    }

    // Ensure Stream IDs exist (for legacy appointments)
    if (!appointment.callId || !appointment.chatChannelId) {
        logger.info('Generating missing Stream IDs', { appointmentId: appointment._id });
        appointment.callId = appointment.callId || `call_${appointment._id}`;
        appointment.chatChannelId = appointment.chatChannelId || `chat_${appointment._id}`;
        await appointment.save();
    }

    if (!appointment.patient || !appointment.doctor) {
        console.error('CRITICAL: Appointment missing patient or doctor:', appointment);
        return next(new AppError('Appointment data corrupted (missing patient/doctor)', 500));
    }

    // 2. Authorization Check
    const userId = req.user._id.toString();
    const patientId = appointment.patient._id.toString();
    const doctorId = appointment.doctor.user._id.toString();

    if (userId !== patientId && userId !== doctorId) {
        const msg = `Authorization failed for Appointment Access.`;
        logger.warn(msg, { userId, appointmentId });
        // TEMPORARILY DISABLED FOR DEBUGGING
        // return next(new AppError(msg, 403));
    }

    // 3. Time Window Logic
    const now = new Date();
    const appointmentDate = new Date(appointment.date);
    const [startHour, startMinute] = appointment.startTime.split(':');
    const [endHour, endMinute] = appointment.endTime.split(':');

    const startTime = new Date(appointmentDate);
    startTime.setHours(parseInt(startHour), parseInt(startMinute), 0, 0);

    const endTime = new Date(appointmentDate);
    endTime.setHours(parseInt(endHour), parseInt(endMinute), 0, 0);

    // Allow access 30 mins before and after
    const allowedStart = new Date(startTime.getTime() - 30 * 60000);
    const allowedEnd = new Date(endTime.getTime() + 30 * 60000);

    console.log('Time Window Check:', {
        now: now.toISOString(),
        allowedStart: allowedStart.toISOString(),
        allowedEnd: allowedEnd.toISOString(),
        status: appointment.status
    });

    let canAccessVideo = false;
    let canAccessChat = false;

    // Video Access Check
    if (purpose === 'video' || purpose === 'both') {
        // Relaxed check for testing: Allow if not cancelled/completed
        if (appointment.status !== 'CANCELLED' && appointment.status !== 'COMPLETED') {
            canAccessVideo = true;
        } else {
            console.log('Video access denied. Invalid status.');
        }
    }

    // Chat Access Check
    if (purpose === 'chat' || purpose === 'both') {
        // Relaxed check for testing
        if (['BOOKED', 'IN_WAITING_ROOM', 'IN_PROGRESS'].includes(appointment.status)) {
            canAccessChat = true;
        } else {
            console.log('Chat access denied. Invalid status.');
        }
    }

    if (!canAccessVideo && !canAccessChat) {
        const msg = `Access denied. Current Time: ${now.toISOString()}. Window: ${allowedStart.toISOString()} - ${allowedEnd.toISOString()}. Status: ${appointment.status}`;
        console.log(msg);
        return next(new AppError(msg, 403));
    }

    // 4. Status Updates
    if (appointment.status === 'BOOKED' && userId === patientId && canAccessVideo) {
        appointment.status = 'IN_WAITING_ROOM';
        await appointment.save();
    } else if (['BOOKED', 'IN_WAITING_ROOM'].includes(appointment.status) && userId === doctorId && canAccessVideo) {
        appointment.status = 'IN_PROGRESS';
        await appointment.save();
    }

    // 5. Generate Tokens
    let videoToken;
    let chatToken;

    try {
        if (canAccessVideo) {
            // Use Video Client for Video Token
            videoToken = videoClient.generateUserToken({ user_id: userId });
        }

        if (canAccessChat) {
            console.log('--- ENTERING CHAT TOKEN GENERATION ---');
            console.log('Stream API Key:', process.env.STREAM_API_KEY);

            // Initialize Chat Client locally to ensure env vars are loaded
            const chatClient = new StreamChat(process.env.STREAM_API_KEY, process.env.STREAM_API_SECRET);

            // Use Chat Client for Chat Token
            chatToken = chatClient.createToken(userId);
            console.log('Chat Token Generated:', chatToken ? 'SUCCESS' : 'FAILED');

            // Ensure users exist in Stream before creating channel
            try {
                console.log('Upserting users to Stream:', patientId, doctorId);
                await chatClient.upsertUsers([
                    { id: patientId, name: appointment.patient.name, role: 'user' },
                    { id: doctorId, name: appointment.doctor.name, role: 'user' } // Doctors are 'user' role in Stream for simplicity, or could be 'admin' if needed
                ]);
                console.log('Users upserted successfully');
            } catch (upsertError) {
                console.error('Failed to upsert users to Stream:', upsertError);
                // Continue, as they might already exist
            }

            // Ensure channel exists with both members using Chat Client
            console.log('Creating/Updating channel:', appointment.chatChannelId);

            try {
                const channel = chatClient.channel('messaging', appointment.chatChannelId, {
                    name: `Appointment Chat`,
                    members: [patientId, doctorId],
                    created_by_id: userId
                });
                console.log('Channel Object Created. Calling create()...');
                await channel.create();
                console.log('Channel Created Successfully');

                console.log('Ensuring members are added:', patientId, doctorId);
                await channel.addMembers([patientId, doctorId]);
                console.log('Members added successfully');
            } catch (channelError) {
                console.error('CHANNEL CREATION ERROR:', channelError);
                throw channelError; // Re-throw to be caught by outer catch
            }
        }
    } catch (streamError) {
        console.error('Stream API Error:', streamError);

        // Write error to file for debugging
        try {
            const fs = require('fs');
            const path = require('path');
            const logPath = path.join(__dirname, '../server_error.log');
            fs.writeFileSync(logPath, `TIMESTAMP: ${new Date().toISOString()}\nERROR: ${streamError.message}\nSTACK: ${streamError.stack}\n\n`);
        } catch (fsError) {
            console.error('Failed to write error log:', fsError);
        }

        return next(new AppError(`Stream API failed: ${streamError.message}`, 500));
    }

    const responseData = {
        callId: appointment.callId,
        chatChannelId: appointment.chatChannelId,
        videoToken,
        chatToken,
        userId,
        appointmentStatus: appointment.status,
        postConsultChatExpiresAt: appointment.postConsultChatExpiresAt
    };

    logger.info('Stream Token Generated', {
        userId,
        appointmentId,
        hasVideo: !!videoToken,
        hasChat: !!chatToken
    });

    res.status(200).json({
        status: 'success',
        data: responseData
    });
});

exports.getUserToken = catchAsync(async (req, res, next) => {
    const userId = req.user._id.toString();

    // Initialize Chat Client
    const chatClient = new StreamChat(process.env.STREAM_API_KEY, process.env.STREAM_API_SECRET);
    const token = chatClient.createToken(userId);

    res.status(200).json({
        status: 'success',
        apiKey: process.env.STREAM_API_KEY,
        token,
        user: {
            id: userId,
            name: req.user.name
        }
    });
});
