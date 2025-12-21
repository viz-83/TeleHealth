const mongoose = require('mongoose');

const medicineOrderSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    medicines: [
        {
            medicine: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Medicine',
                required: true
            },
            name: String, // Snapshot of name at purchase
            quantity: {
                type: Number,
                required: true,
                min: 1
            },
            priceAtPurchase: {
                type: Number,
                required: true
            }
        }
    ],
    prescription: {
        // Defines the uploaded prescription or linked digital prescription
        type: String, // URL to the prescription image/PDF
        required: false
    },
    totalAmount: {
        type: Number,
        required: true
    },
    deliveryAddress: {
        fullAddress: { type: String, required: true },
        city: { type: String, required: true },
        pincode: { type: String, required: true }
    },
    status: {
        type: String,
        enum: [
            "PLACED",               // Order created, no prescription needed or prescription provided (auto-check logic in controller)
            "PRESCRIPTION_PENDING", // Wait for admin to verify
            "VERIFIED",             // Admin approved
            "PACKED",               // Ready for dispatch
            "OUT_FOR_DELIVERY",
            "DELIVERED",
            "CANCELLED"
        ],
        default: "PLACED"
    },
    statusHistory: [
        {
            status: String,
            changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            changedAt: { type: Date, default: Date.now },
            note: String
        }
    ]
}, { timestamps: true });

// Populate helpers
medicineOrderSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'patient',
        select: 'name email'
    }).populate({
        path: 'medicines.medicine',
        select: 'name brand image category'
    });
    next();
});

module.exports = mongoose.model('MedicineOrder', medicineOrderSchema);
