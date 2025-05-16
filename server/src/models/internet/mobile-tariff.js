const mongoose = require("mongoose");

const mobileTariffSchema = new mongoose.Schema({
    type: String,
    simPrice: Number,
    validity: String,
    packagePrice: Number,
    minutes: Number,
    image: {
        type: String,
        required: false,
    },
});

const MobileTariff = mongoose.model('MobileTariff', mobileTariffSchema);
module.exports = MobileTariff;
