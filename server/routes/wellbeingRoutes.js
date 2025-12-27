const express = require('express');
const wellbeingAIController = require('../controllers/wellbeingAIController');
const authController = require('../controllers/authController');

const router = express.Router();

const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 5, // Limit each IP to 5 requests per windowMs
    message: {
        status: 'fail',
        message: 'Too many messages, please wait a moment before sending more.'
    }
});

// Protected Route - Only logged in users can access support
router.post('/message', authController.protect, apiLimiter, wellbeingAIController.handleMessage);


module.exports = router;
