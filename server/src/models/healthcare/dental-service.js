const mongoose = require("mongoose");

const DentalServiceSchema = new mongoose.Schema({
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

const DentalService = mongoose.model("DentalService", DentalServiceSchema);
module.exports = DentalService;
