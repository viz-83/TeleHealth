const User = require('../models/User');
const sendEmail = require('../utils/email');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const fs = require('fs');

exports.signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = generateOTP();
        const otpExpires = Date.now() + 10 * 60 * 1000; // 10 mins

        user = new User({
            name,
            email,
            password: hashedPassword,
            role,
            otp,
            otpExpires
        });

        await user.save();

        try {
            await sendEmail({
                email,
                subject: 'Your OTP Code',
                message: `Your OTP code is ${otp}`
            });
        } catch (emailError) {
            const logMsg = `[${new Date().toISOString()}] Email Error: ${emailError.message}\n`;
            fs.appendFileSync('debug.log', logMsg);
            console.error('Email Send Error:', emailError);

            try {
                await User.deleteOne({ _id: user._id });
                fs.appendFileSync('debug.log', `[${new Date().toISOString()}] User deleted successfully\n`);
            } catch (delError) {
                fs.appendFileSync('debug.log', `[${new Date().toISOString()}] Delete Error: ${delError.message}\n`);
            }

            return res.status(500).json({ message: 'Failed to send OTP email. Please check your email address or try again later.' });
        }

        res.status(201).json({ message: 'User registered. Please verify OTP.' });
    } catch (error) {
        const logMsg = `[${new Date().toISOString()}] Signup Error: ${error.message}\n`;
        fs.appendFileSync('debug.log', logMsg);
        console.error('Signup Error:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ message: 'User not found' });
        if (user.isVerified) return res.status(400).json({ message: 'User already verified' });
        if (user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.cookie('token', token, { httpOnly: true }).json({ message: 'Verification successful', token, user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ message: 'Invalid credentials' });
        if (!user.isVerified) return res.status(400).json({ message: 'Please verify your email first' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.cookie('token', token, { httpOnly: true }).json({ message: 'Login successful', token, user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
