const mongoose = require('mongoose');

const availabilitySlotSchema = new mongoose.Schema({
    dayOfWeek: {
        type: Number,
        required: true,
        min: 0, // 0 = Sunday
        max: 6  // 6 = Saturday
    },
    startTime: {
        type: String, // Format: "HH:mm"
        required: true
    },
    endTime: {
        type: String, // Format: "HH:mm"
        required: true
    }
});

const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A doctor must have a name']
    },
    specialization: {
        type: String,
        required: [true, 'A doctor must have a specialization']
    },
    hospitalName: {
        type: String,
        required: [true, 'A doctor must have a hospital name']
    },
    location: {
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true },
        fullAddress: { type: String, required: true },
        coordinates: {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number] // [longitude, latitude]
        }
    },
    availabilitySlots: [availabilitySlotSchema],
    isActive: {
        type: Boolean,
        default: true
    }
});

// 2dsphere index for geospatial queries
doctorSchema.index({ 'location.coordinates': '2dsphere' });

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;
