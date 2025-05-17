const mongoose = require("mongoose");

const ComputerRepairSchema = new mongoose.Schema({
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

const ComputerRepair = mongoose.model("ComputerRepair", ComputerRepairSchema);
module.exports = ComputerRepair;
