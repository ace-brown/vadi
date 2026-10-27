const mongoose = require('mongoose');
const { createPlaceSchema } = require('../schemas/place-schema');

const AnimalBasedProducts = mongoose.model('AnimalBasedProducts', createPlaceSchema());
module.exports = AnimalBasedProducts;
