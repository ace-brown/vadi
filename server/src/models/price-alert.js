const mongoose = require('mongoose');

// "Tell me when this offer costs at most X per month" (effective price)
const priceAlertSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        offerType: { type: String, required: true, enum: ['home', 'mobile'] },
        offer: { type: mongoose.Schema.Types.ObjectId, required: true },
        targetPrice: { type: Number, required: true, min: 0 },
        // Switched off once the alert has fired; setting a new target turns it on again
        active: { type: Boolean, default: true, index: true },
        triggeredAt: { type: Date, default: null },
        triggeredPrice: { type: Number, default: null },
    },
    { timestamps: true }
);

priceAlertSchema.index({ user: 1, offer: 1 }, { unique: true });

module.exports = mongoose.model('PriceAlert', priceAlertSchema);
