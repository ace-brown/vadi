const mongoose = require("mongoose");

const MobileRepairSchema = new mongoose.Schema({
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

const MobileRepair = mongoose.model("MobileRepair", MobileRepairSchema);
module.exports = MobileRepair;
