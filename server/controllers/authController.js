const User = require('../models/User');
const Doctor = require('../models/doctorModel');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { StreamChat } = require('stream-chat');
const RefreshToken = require('../models/RefreshToken');
const logAudit = require('../utils/auditLogger');
const logger = require('../utils/logger');

const streamClient = new StreamChat(process.env.STREAM_API_KEY, process.env.STREAM_API_SECRET);



const signToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '15m' // Short lived access token
    });
};

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

const createSendToken = async (user, statusCode, res, isDoctorProfileComplete = false) => {
    const token = signToken(user._id, user.role);

    // Generate Refresh Token
    const rawRefreshToken = crypto.randomBytes(40).toString('hex');
    const hashedRefreshToken = hashToken(rawRefreshToken);
    const refreshTokenExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Save HASHED Refresh Token to DB
    await RefreshToken.create({
        user: user._id,
        token: hashedRefreshToken,
        expiresAt: refreshTokenExpires
    });

    const isProduction = process.env.NODE_ENV === 'production';

    const cookieOptions = {
        expires: new Date(Date.now() + 15 * 60 * 1000), // Match access token
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax'
    };

    const refreshCookieOptions = {
        expires: refreshTokenExpires,
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax', // Strict for same-site, Lax for dev if needed
        path: '/api/auth/refresh-token' // Restrict path
    };

    // Send Cookies
    res.cookie('token', token, cookieOptions);
    res.cookie('refreshToken', rawRefreshToken, refreshCookieOptions); // Send RAW token to user

    // Remove sensitive data from output
    user.password = undefined;
    user.otp = undefined;
    user.loginAttempts = undefined;
    user.loginLockedUntil = undefined;
    user.otpAttempts = undefined;
    user.otpLockedUntil = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        user,
        isDoctorProfileComplete,
        data: { user }
    });
};

exports.signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);

        // CREATE USER (Auto-Verified, No OTP)
        user = new User({
            name,
            email,
            password: hashedPassword,
            role,
            isVerified: true // <--- Auto verify
        });

        await user.save();

        // Sync user to Stream
        try {
            await streamClient.upsertUser({
                id: user._id.toString(),
                name: user.name,
                role: user.role === 'admin' ? 'admin' : 'user'
            });
        } catch (streamError) {
            console.error('Stream Sync Error (Signup):', streamError);
        }

        // Audit Log
        logAudit(req, {
            user: user, // User exists now
            action: 'SIGNUP_COMPLETED',
            details: { email, role, method: 'direct_no_otp' }
        });

        // Log them in immediately
        createSendToken(user, 201, res);

    } catch (error) {
        logger.error('Signup Error', { error: error.message, stack: error.stack });
        res.status(500).json({ message: error.message });
    }
};

// verifyOTP removed

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        // 1. Check if account is locked
        if (user.loginLockedUntil && user.loginLockedUntil > Date.now()) {
            const waitTime = Math.ceil((user.loginLockedUntil - Date.now()) / 60000);
            return res.status(429).json({ message: `Account locked. Please try again in ${waitTime} minutes.` });
        }

        // 2. Check Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            // Increment Failed Attempts
            user.loginAttempts += 1;

            // Lock if attempts > 5
            if (user.loginAttempts >= 5) {
                user.loginLockedUntil = Date.now() + 15 * 60 * 1000; // 15 mins
                user.loginAttempts = 0; // Reset attempts after locking (or keep 5?) typically reset on lock expiry, but simplifying by keeping attempts high or resetting on successful login is better. Resetting on lock expiry requires a cron or logic check.
                // Simple strategy: Just set lock time. If they come back after 15 mins, lock is gone.
                // But we should reset attempts on successful login.
                await user.save();
                return res.status(429).json({ message: 'Too many failed login attempts. Account locked for 15 minutes.' });
            }

            await user.save();
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        if (!user.isVerified) {
            // Auto-verify legacy users or just allow them? 
            // Let's just allow them and maybe update the flag implicitly or ignore it.
            // Updating it is safer for consistency.
            user.isVerified = true;
            await user.save();
        }

        // 3. Reset Locking Fields on Success
        user.loginAttempts = 0;
        user.loginLockedUntil = undefined;
        await user.save();

        // Sync user to Stream on login
        try {
            await streamClient.upsertUser({
                id: user._id.toString(),
                name: user.name,
                role: user.role === 'admin' ? 'admin' : 'user'
            });
        } catch (streamError) {
            console.error('Stream Sync Error (Login):', streamError);
        }

        let isDoctorProfileComplete = false;
        if (user.role === 'doctor') {
            const doctor = await Doctor.findOne({ user: user._id });
            if (doctor) isDoctorProfileComplete = true;
        }

        // Audit Log
        logAudit(req, {
            user: user,
            action: 'LOGIN',
            details: { method: 'password' }
        });

        createSendToken(user, 200, res, isDoctorProfileComplete);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body; // Frontend sends refresh token in body now via axiosInstance? No, cookie.
        // Wait, earlier I implemented axiosInstance which calls POST /refresh-token.
        // And backend uses req.cookies.refreshToken.
        const tokenFromCookie = req.cookies.refreshToken;

        if (!tokenFromCookie) {
            return res.status(401).json({ message: 'No refresh token provided' });
        }

        // Hash the incoming token to match DB
        const hashedToken = hashToken(tokenFromCookie);

        const tokenDoc = await RefreshToken.findOne({ token: hashedToken });

        // Reuse Detection / Token Rotation Logic
        if (!tokenDoc) {
            // If token not found, it might be tampered or already rotated/deleted.
            // Just clear and fail.
            res.clearCookie('token');
            res.clearCookie('refreshToken', { path: '/api/auth/refresh-token' });
            return res.status(403).json({ message: 'Invalid refresh token' });
        }

        if (tokenDoc.isExpired || tokenDoc.revoked) {
            // Security: If a revoked token is used, it might be a theft.
            // Ideally, we should revoke all tokens for this user family, but for now simple 403.
            res.clearCookie('token');
            res.clearCookie('refreshToken', { path: '/api/auth/refresh-token' });
            return res.status(403).json({ message: 'RefreshToken is expired or revoked' });
        }

        // Get user
        const user = await User.findById(tokenDoc.user);
        if (!user) {
            return res.status(401).json({ message: 'User belonging to token no longer exists' });
        }

        // Rotate Token (Revoke old, create new)
        tokenDoc.revoked = Date.now();
        tokenDoc.replacedByToken = 'new_generated_in_createSendToken';
        await tokenDoc.save();

        let isDoctorProfileComplete = false;
        if (user.role === 'doctor') {
            const doctor = await Doctor.findOne({ user: user._id });
            if (doctor) isDoctorProfileComplete = true;
        }

        // Issue new tokens (creates new DB entry)
        createSendToken(user, 200, res, isDoctorProfileComplete);

    } catch (error) {
        console.error('Refresh Token Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (refreshToken) {
            const hashedToken = hashToken(refreshToken);
            // Revoke token in DB
            await RefreshToken.findOneAndUpdate({ token: hashedToken }, { revoked: Date.now() });
        }

        res.clearCookie('token');
        res.clearCookie('refreshToken', { path: '/api/auth/refresh-token' });

        // Audit Log
        if (req.user) {
            logAudit(req, {
                user: req.user,
                action: 'LOGOUT',
                details: { method: 'explicit_logout' }
            });
        }

        res.status(200).json({ status: 'success', message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Logout failed', error: error.message });
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
        // console.log('headers', req.headers); // Remove noisy logs in production

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies.token) {
            token = req.cookies.token;
        } else if (req.query.token) {
            token = req.query.token; // Allow token in query param for downloads
        }

        if (!token) {
            return res.status(401).json({ message: 'You are not logged in! Please log in to get access.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            return res.status(401).json({ message: 'The user belonging to this token no longer does exist.' });
        }

        if (currentUser.loginLockedUntil && currentUser.loginLockedUntil > Date.now()) {
            return res.status(401).json({ message: 'Account is locked. Please contact support or try later.' });
        }

        req.user = currentUser;
        next();
    } catch (error) {
        // console.error('Protect Middleware Error:', error);
        res.status(401).json({ message: 'Invalid token. Please log in again.' });
    }
};

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        // roles ['admin', 'doctor']. role='user'
        if (!roles.includes(req.user.role)) {
            // Audit Unauthorized Access Attempt
            logAudit(req, {
                user: req.user,
                action: 'UNAUTHORIZED_ACCESS_ATTEMPT',
                resourceType: 'API_ROUTE',
                details: { requiredRoles: roles, userRole: req.user.role, path: req.originalUrl }
            });
            return res.status(403).json({ message: 'You do not have permission to perform this action' });
        }
        next();
    };
};

