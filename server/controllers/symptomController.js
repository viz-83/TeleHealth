const symptomRules = require('../config/symptomRules');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Priority map for severity comparison
const severityPriority = {
    'EMERGENCY': 4,
    'HIGH': 3,
    'MEDIUM': 2,
    'LOW': 1
};

exports.analyzeSymptoms = catchAsync(async (req, res, next) => {
    const { symptoms } = req.body;

    if (!symptoms) {
        return next(new AppError('Please provide symptoms description', 400));
    }

    const symptomsLower = symptoms.toLowerCase();
    let highestSeverity = 'LOW';
    let matchedSpecializations = new Set();
    let emergencyMessage = null;

    // Rule-based matching
    for (const rule of symptomRules) {
        // Check if any keyword matches
        const isMatch = rule.keywords.some(keyword => symptomsLower.includes(keyword.toLowerCase()));

        if (isMatch) {
            matchedSpecializations.add(rule.specialization);

            // Update severity if higher
            if (severityPriority[rule.severity] > severityPriority[highestSeverity]) {
                highestSeverity = rule.severity;
                if (rule.emergencyMessage) {
                    emergencyMessage = rule.emergencyMessage;
                }
            }
        }
    }

    // Default if no match
    if (matchedSpecializations.size === 0) {
        matchedSpecializations.add('General Physician');
    }

    // Determine emergency flag
    const emergencyCareRequired = highestSeverity === 'EMERGENCY';

    res.status(200).json({
        status: 'success',
        data: {
            suggestedSpecializations: Array.from(matchedSpecializations),
            severity: highestSeverity,
            emergencyCareRequired,
            message: emergencyMessage || (emergencyCareRequired ? 'Seek emergency care immediately.' : 'Based on your symptoms, we recommend consulting these specialists.')
        }
    });
});
