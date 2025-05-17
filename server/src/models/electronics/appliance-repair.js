const mongoose = require("mongoose");

const ApplianceRepairSchema = new mongoose.Schema({
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

const ApplianceRepair = mongoose.model("ApplianceRepair", ApplianceRepairSchema);
module.exports = ApplianceRepair;
