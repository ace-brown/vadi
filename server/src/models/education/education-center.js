const mongoose = require("mongoose");

const EduCenterSchema = new mongoose.Schema({
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

const EduCenter = mongoose.model("EduCenter", EduCenterSchema);
module.exports = EduCenter;
