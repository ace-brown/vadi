const mongoose = require('mongoose');
const { createPlaceSchema } = require('../schemas/place-schema');

const Bookstore = mongoose.model('Bookstore', createPlaceSchema());
module.exports = Bookstore;
