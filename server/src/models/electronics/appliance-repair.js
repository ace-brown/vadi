const mongoose = require('mongoose');
const { createPlaceSchema } = require('../schemas/place-schema');

const ApplianceRepair = mongoose.model('ApplianceRepair', createPlaceSchema());
module.exports = ApplianceRepair;
