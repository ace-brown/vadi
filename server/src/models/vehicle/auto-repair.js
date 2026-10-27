const mongoose = require('mongoose');
const { createPlaceSchema } = require('../schemas/place-schema');

const AutoRepair = mongoose.model('AutoRepair', createPlaceSchema());
module.exports = AutoRepair;
