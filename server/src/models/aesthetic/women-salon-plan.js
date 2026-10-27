const mongoose = require('mongoose');
const { createPricedPlaceSchema } = require('../schemas/place-schema');

const WOMEN_SALON_PRICE_FIELDS = [
    'faceCarePrice',
    'hairBotoxPrice',
    'hairColorPrice',
    'makeupPrice',
    'eyelashExtensionPrice',
    'eyebrowShapePrice',
    'eyebrowLiftPrice',
    'nailExtensionPrice',
    'manicurePrice',
    'waxingPrice',
];

const WomenSalonPlan = mongoose.model('WomenSalonPlan', createPricedPlaceSchema(WOMEN_SALON_PRICE_FIELDS));
module.exports = WomenSalonPlan;
module.exports.PRICE_FIELDS = WOMEN_SALON_PRICE_FIELDS;
