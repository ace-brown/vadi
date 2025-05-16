const mongoose = require("mongoose");

const homeTariffSchema = new mongoose.Schema({
    title: String,
    speed: String,
    duration: String,
    volume: String,
    netType: String,
    price: Number,
    image: {
        type: String,
        required: false,
    },
});

const HomeTariff = mongoose.model('HomeTariff', homeTariffSchema);
module.exports = HomeTariff;
