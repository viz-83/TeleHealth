const express = require('express');
const router = express.Router();
const { generateToken } = require('../controllers/streamController');

router.post('/token', generateToken);

module.exports = router;
