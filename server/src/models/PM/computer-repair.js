const mongoose = require('mongoose');
const { createPlaceSchema } = require('../schemas/place-schema');

const ComputerRepair = mongoose.model('ComputerRepair', createPlaceSchema());
module.exports = ComputerRepair;
