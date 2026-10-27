const mongoose = require('mongoose');
const { createPlaceSchema } = require('../schemas/place-schema');

const MotorcycleRepair = mongoose.model('MotorcycleRepair', createPlaceSchema());
module.exports = MotorcycleRepair;
