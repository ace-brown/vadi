const mongoose = require("mongoose");

const GardenSuppliesSchema = new mongoose.Schema({
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

const GardenSupplies = mongoose.model("GardenSupplies", GardenSuppliesSchema);
module.exports = GardenSupplies;
