const express = require('express');
const symptomController = require('../controllers/symptomController');

const router = express.Router();

// Public route - anyone can check symptoms
router.post('/analyze', symptomController.analyzeSymptoms);

module.exports = router;
