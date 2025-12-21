const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['patient', 'doctor', 'admin', 'pharmacy_admin'],
        default: 'patient'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    otp: String,
    otpExpires: Date,
    // Security Fields
    loginAttempts: { type: Number, default: 0 },
    loginLockedUntil: Date,
    otpAttempts: { type: Number, default: 0 },
    otpLockedUntil: Date
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
