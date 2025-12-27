const express = require('express');
// Server restart trigger - v5
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const dotenv = require('dotenv');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
}));
app.use(express.json({ limit: '10kb' })); // Body limit

// 1. Security Headers
const helmet = require('helmet');
app.use(helmet());

// 2. Data Sanitization against NoSQL query injection
const mongoSanitize = require('express-mongo-sanitize');
app.use(mongoSanitize());

// 3. Data Sanitization against XSS
const xss = require('xss-clean');
app.use(xss());

// 4. Rate Limiting
const rateLimit = require('express-rate-limit');

// Value-Added: Rate Limiters
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100, // 100 requests per 15 mins
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', globalLimiter);

const authLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 10, // 10 login/signup attempts per 10 mins (Relaxed from 5 to avoid accidental blocks in testing)
    message: { message: 'Too many auth attempts, please try again later.' }
});
app.use('/api/auth', authLimiter);

const otpLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 6, // 6 OTP attempts (enough for 1 retry and some errors)
    message: { message: 'Too many OTP verifications, please try again later.' }
});
app.use('/api/auth/verify-otp', otpLimiter);

app.get('/test-root', (req, res) => {
    console.log('Root test route hit!');
    res.json({ message: 'Root route works!' });
});


app.use(cookieParser());

// Request Logger
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// Routes
app.use((req, res, next) => {
    console.log(`[Server] Incoming Request: ${req.method} ${req.url}`);
    next();
});

app.use('/api/auth', require('./routes/authRoutes'));

const streamRoutes = require('./routes/streamRoutes');
app.use('/api/v1/stream', streamRoutes);

app.get('/api/v1/stream-test', (req, res) => {
    res.json({ message: 'Inline route works!' });
});

app.use('/api/v1/doctors', require('./routes/doctorRoutes'));
app.use('/api/v1/appointments', require('./routes/appointmentRoutes'));
app.use('/api/v1/prescriptions', require('./routes/prescriptionRoutes'));
app.use('/api/v1/reports', require('./routes/reportRoutes'));
app.use('/api/v1/symptoms', require('./routes/symptomRoutes'));
app.use('/api/v1/ambulance', require('./routes/ambulanceRoutes'));
app.use('/api/v1/health-metrics', require('./routes/healthMetricRoutes'));
app.use('/api/v1/tests', require('./routes/diagnosticTestRoutes')); // Diagnostic tests
app.use('/api/v1/test-orders', require('./routes/diagnosticOrderRoutes')); // Test orders
app.use('/api/v1/medicines', require('./routes/medicineRoutes')); // Medicine catalog
app.use('/api/v1/medicine-orders', require('./routes/medicineOrderRoutes')); // Medicine orders
app.use('/api/v1/payments', require('./routes/paymentRoutes')); // Payment Gateway
app.use('/api/v1/assistant', require('./routes/aiAssistantRoutes')); // AI Assistant
app.use('/api/v1/wellbeing', require('./routes/wellbeingRoutes')); // Wellbeing Space

// app.use('/prescriptions', express.static('prescriptions'));

app.get('/', (req, res) => {
    res.send('MedSync API is running...');
});

// 404 Handler
app.use((req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handler
app.use(globalErrorHandler);

app.listen(PORT, () => {
    console.log(`MedSync Server running on port ${PORT}`);
});
