const mongoose = require("mongoose");

const AutoRepairSchema = new mongoose.Schema({
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

const AutoRepair = mongoose.model("AutoRepair", AutoRepairSchema);
module.exports = AutoRepair;
