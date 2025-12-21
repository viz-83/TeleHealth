const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Medicine name is required'],
        trim: true
    },
    brand: {
        type: String,
        trim: true
    },
    composition: {
        type: String,
        required: [true, 'Composition is required']
    },
    category: {
        type: String,
        enum: [
            "Tablets",
            "Capsules",
            "Syrups",
            "Tonics",
            "Injections",
            "OTC",
            "Chronic Care",
            "Vitamins & Supplements",
            "First Aid",
            "Healthcare Devices"
        ],
        required: true,
        index: true
    },
    dosageForm: {
        type: String, // e.g., Tablet, Syrup, Injection
        required: true
    },
    strength: {
        type: String, // e.g., "500mg", "10ml"
        required: true
    },
    prescriptionRequired: {
        type: Boolean,
        default: false,
        index: true
    },
    price: {
        type: Number,
        required: [true, 'Price is required']
    },
    stockQuantity: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    description: {
        type: String,
        trim: true
    },
    image: {
        type: String,
        default: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800'
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true
    }
}, { timestamps: true });

medicineSchema.index({ name: 'text', composition: 'text', brand: 'text' });

module.exports = mongoose.model('Medicine', medicineSchema);
