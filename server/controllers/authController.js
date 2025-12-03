const User = require('../models/User');
const sendEmail = require('../utils/email');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

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
            console.error('Email Send Error:', emailError);

            try {
                await User.deleteOne({ _id: user._id });
            } catch (delError) {
                // ignore
            }

            return res.status(500).json({ message: 'Failed to send OTP email. Please check your email address or try again later.' });
        }

        res.status(201).json({ message: 'User registered. Please verify OTP.' });
    } catch (error) {
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

        const cookieOptions = {
            httpOnly: true,
            secure: false, // Set to true in production
            sameSite: 'lax'
        };
        console.log('Setting Cookie (VerifyOTP):', cookieOptions);
        res.cookie('token', token, cookieOptions).json({ message: 'Verification successful', token, user });
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

        const cookieOptions = {
            httpOnly: true,
            secure: false, // Set to true in production
            sameSite: 'lax'
        };
        console.log('Setting Cookie (Login):', cookieOptions);
        res.cookie('token', token, cookieOptions).json({ message: 'Login successful', token, user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.body.userId } }).select('-password -otp -otpExpires');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.protect = async (req, res, next) => {
    try {
        let token;

        console.log('--- Protect Middleware Debug ---');
        console.log('Headers:', req.headers);
        console.log('Cookies:', req.cookies);

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies.token) {
            token = req.cookies.token;
        }

        if (!token) {
            console.log('No token found!');
            return res.status(401).json({ message: 'You are not logged in! Please log in to get access.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded Token:', decoded);

        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            console.log('User not found for token');
            return res.status(401).json({ message: 'The user belonging to this token no longer does exist.' });
        }

        req.user = currentUser;
        next();
    } catch (error) {
        console.error('Protect Middleware Error:', error);
        res.status(401).json({ message: 'Invalid token. Please log in again.' });
    }
};
