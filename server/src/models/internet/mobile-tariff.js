const mongoose = require("mongoose");
const { createOfferSchema } = require('../schemas/offer-schema');
require('../price-history');

const mobileTariffSchema = createOfferSchema({
    contractType: { type: String, required: true, enum: ['prepaid', 'contract'], index: true },
    network: { type: String, required: true, enum: ['4G', '5G'] },
    // null means unlimited
    dataGB: { type: Number, min: 0, default: null },
    minutes: { type: Number, min: 0, default: null },
}, 'mobile');

const MobileTariff = mongoose.model('MobileTariff', mobileTariffSchema);
module.exports = MobileTariff;
