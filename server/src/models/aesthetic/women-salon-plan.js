const mongoose = require("mongoose");

const WomenSalonPlanSchema = new mongoose.Schema({
    title: String,
    faceCarePrice: Number,
    hairBotoxPrice: Number,
    hairColorPrice: Number,
    makeupPrice: Number,
    eyelashExtensionPrice: Number,
    eyebrowShapePrice: Number,
    eyebrowLiftPrice: Number,
    nailExtensionPrice: Number,
    manicurePrice: Number,
    waxingPrice: Number,
    image: {
        type: String,
        required: false,
    },
});

const WomenSalonPlan = mongoose.model('WomenSalonPlan', WomenSalonPlanSchema);
module.exports = WomenSalonPlan;
