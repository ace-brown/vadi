const mongoose = require("mongoose");

const BookstoreSchema = new mongoose.Schema({
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

const Bookstore = mongoose.model("Bookstore", BookstoreSchema);
module.exports = Bookstore;
