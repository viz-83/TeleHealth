const mongoose = require('mongoose');

const diagnosticTestSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A diagnostic test must have a name'],
        trim: true
    },
    category: {
        type: String,
        required: [true, 'A test must have a category'],
        enum: ['Blood Test', 'Diabetes', 'Thyroid', 'Heart', 'Women Health', 'Full Body']
    },
    description: {
        type: String,
        required: [true, 'A test description is required']
    },
    preparationInstructions: {
        type: String,
        default: 'No special preparation needed.'
    },
    fastingRequired: {
        type: Boolean,
        default: false
    },
    sampleType: {
        type: String,
        required: [true, 'Sample type is required'],
        enum: ['Blood', 'Urine', 'Swab', 'Stool', 'Other']
    },
    price: {
        type: Number,
        required: [true, 'Test price is required']
    },
    image: {
        type: String,
        default: 'https://images.unsplash.com/photo-1579684385180-87779d713c54?auto=format&fit=crop&q=80&w=800' // Generic medical placeholder
    },
    isHomeCollectionAvailable: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Indexes for faster querying
diagnosticTestSchema.index({ category: 1 });
diagnosticTestSchema.index({ isActive: 1 });

const DiagnosticTest = mongoose.model('DiagnosticTest', diagnosticTestSchema);

module.exports = DiagnosticTest;
