const mongoose = require('mongoose');

// One entry each time an offer's effective price changes (and when it is created)
const priceHistorySchema = new mongoose.Schema(
    {
        offerType: { type: String, required: true, enum: ['home', 'mobile'] },
        offer: { type: mongoose.Schema.Types.ObjectId, required: true },
        effectiveMonthlyPrice: { type: Number, required: true },
        monthlyPrice: { type: Number, required: true },
    },
    { timestamps: { createdAt: 'recordedAt', updatedAt: false } }
);

priceHistorySchema.index({ offer: 1, recordedAt: 1 });

module.exports = mongoose.models.PriceHistory || mongoose.model('PriceHistory', priceHistorySchema);
