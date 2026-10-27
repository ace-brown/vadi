const mongoose = require('mongoose');
const { createPlaceSchema } = require('../schemas/place-schema');

const MobileRepair = mongoose.model('MobileRepair', createPlaceSchema());
module.exports = MobileRepair;
