const express = require('express');
// Server restart trigger
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
app.use(express.json());

app.get('/test-root', (req, res) => {
    console.log('Root test route hit!');
    res.json({ message: 'Root route works!' });
});

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
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

app.get('/', (req, res) => {
    res.send('Telehealth API is running...');
});

// 404 Handler
app.use((req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handler
app.use(globalErrorHandler);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} - Updated V2`);
});
