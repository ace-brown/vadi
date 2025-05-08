const mongoose = require("mongoose");

const mobileTariffSchema = new mongoose.Schema({
    type: String,
    simPrice: String,
    validity: String,
    packagePrice: String,
    minutes: String,
    image: String,
});

const MobileTariff = mongoose.model('MobileTariff', mobileTariffSchema);
module.exports = MobileTariff;
