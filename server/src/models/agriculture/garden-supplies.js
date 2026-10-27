const mongoose = require('mongoose');
const { createPlaceSchema } = require('../schemas/place-schema');

const GardenSupplies = mongoose.model('GardenSupplies', createPlaceSchema());
module.exports = GardenSupplies;
