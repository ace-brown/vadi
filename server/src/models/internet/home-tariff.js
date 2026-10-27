const mongoose = require("mongoose");
const { createOfferSchema } = require('../schemas/offer-schema');

const homeTariffSchema = createOfferSchema({
    connectionType: { type: String, required: true, enum: ['DSL', 'VDSL', 'Cable', 'Fiber', 'LTE'], index: true },
    downloadMbps: { type: Number, required: true, min: 0 },
    uploadMbps: { type: Number, required: true, min: 0 },
    // Where the offer can be booked: everywhere, or only in postcodes starting with these prefixes
    coverage: {
        nationwide: { type: Boolean, default: true },
        postcodePrefixes: {
            type: [{ type: String, match: /^\d{1,5}$/ }],
            default: [],
        },
    },
});

const HomeTariff = mongoose.model('HomeTariff', homeTariffSchema);
module.exports = HomeTariff;
