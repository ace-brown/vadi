const mongoose = require("mongoose");

const AnimalBasedProductsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: false,
    },
    address: {
        type: String,
        required: false,
    },
    services: {
        type: [String],
        required: false,
    },
    image: {
        type: String,
        required: false,
    }
});

const AnimalBasedProducts = mongoose.model("AnimalBasedProducts", AnimalBasedProductsSchema);
module.exports = AnimalBasedProducts;
