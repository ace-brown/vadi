const mongoose = require('mongoose');
const { createPlaceSchema } = require('../schemas/place-schema');

const EduCenter = mongoose.model('EduCenter', createPlaceSchema());
module.exports = EduCenter;
