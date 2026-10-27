const mongoose = require("mongoose");

const homeTariffSchema = new mongoose.Schema(
    {
        provider: { type: String, required: true, trim: true, maxlength: 80 },
        name: { type: String, required: true, trim: true, maxlength: 80 },
        connectionType: { type: String, required: true, enum: ['DSL', 'VDSL', 'Cable', 'Fiber', 'LTE'] },
        downloadMbps: { type: Number, required: true, min: 0 },
        uploadMbps: { type: Number, required: true, min: 0 },
        termMonths: { type: Number, required: true, enum: [1, 12, 24] },
        monthlyPrice: { type: Number, required: true, min: 0 },
        setupFee: { type: Number, min: 0, default: 0 },
        image: { type: String, trim: true, maxlength: 300 },
    },
    { timestamps: true }
);

const HomeTariff = mongoose.model('HomeTariff', homeTariffSchema);
module.exports = HomeTariff;
