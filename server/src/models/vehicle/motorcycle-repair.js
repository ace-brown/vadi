const mongoose = require("mongoose");

const MotorcycleRepairSchema = new mongoose.Schema({
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

const MotorcycleRepair = mongoose.model("MotorcycleRepair", MotorcycleRepairSchema);
module.exports = MotorcycleRepair;
