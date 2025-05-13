const mongoose = require("mongoose");

const mobileTariffSchema = new mongoose.Schema({
    type: String,
    simPrice: Number,
    validity: String,
    packagePrice: Number,
    minutes: Number,
    image: String,
});

const MobileTariff = mongoose.model('MobileTariff', mobileTariffSchema);
module.exports = MobileTariff;
