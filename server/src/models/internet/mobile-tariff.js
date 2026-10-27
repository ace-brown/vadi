const mongoose = require("mongoose");

const mobileTariffSchema = new mongoose.Schema(
    {
        provider: { type: String, required: true, trim: true, maxlength: 80 },
        name: { type: String, required: true, trim: true, maxlength: 80 },
        contractType: { type: String, required: true, enum: ['prepaid', 'contract'] },
        network: { type: String, required: true, enum: ['4G', '5G'] },
        // null means unlimited
        dataGB: { type: Number, min: 0, default: null },
        minutes: { type: Number, min: 0, default: null },
        termMonths: { type: Number, required: true, enum: [1, 12, 24] },
        monthlyPrice: { type: Number, required: true, min: 0 },
        setupFee: { type: Number, min: 0, default: 0 },
        image: { type: String, trim: true, maxlength: 300 },
    },
    { timestamps: true }
);

const MobileTariff = mongoose.model('MobileTariff', mobileTariffSchema);
module.exports = MobileTariff;
