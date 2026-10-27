const mongoose = require('mongoose');
const { createPricedPlaceSchema } = require('../schemas/place-schema');

const MEN_SALON_PRICE_FIELDS = ['haircutPrice', 'menLiftPrice', 'groomMakeupPrice', 'curlyHairDoPrice'];

const MenSalonPlan = mongoose.model('MenSalonPlan', createPricedPlaceSchema(MEN_SALON_PRICE_FIELDS));
module.exports = MenSalonPlan;
module.exports.PRICE_FIELDS = MEN_SALON_PRICE_FIELDS;
