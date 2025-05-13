const mongoose = require("mongoose");

const MenSalonPlanSchema = new mongoose.Schema({
    title: String,
    haircutPrice: Number,
    menLiftPrice: Number,
    groomMakeupPrice: Number,
    curlyHairDoPrice: Number,
    image: String,
});

const MenSalonPlan = mongoose.model('MenSalonPlan', MenSalonPlanSchema);
module.exports = MenSalonPlan;
