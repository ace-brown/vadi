const mongoose = require('mongoose');
const { createPlaceSchema } = require('../schemas/place-schema');

const DentalService = mongoose.model('DentalService', createPlaceSchema());
module.exports = DentalService;
