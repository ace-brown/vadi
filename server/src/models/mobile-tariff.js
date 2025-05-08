const mongoose = require("mongoose");

const mobileTariffSchema = new mongoose.Schema({
    type: String,
    simPrice: String,
    validity: String,
    packagePrice: String,
    minutes: String,
    image: String,
});

export default mongoose.model("MobileTariff", mobileTariffSchema);
