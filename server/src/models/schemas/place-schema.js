const mongoose = require('mongoose');

// Fields shared by every listing that is a physical place (shops, clinics, salons...)
const placeFields = {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    address: { type: String, required: true, trim: true, maxlength: 200 },
    city: { type: String, required: true, trim: true, maxlength: 80, index: true },
    state: { type: String, required: true, trim: true, maxlength: 80 },
    rating: { type: Number, min: 0, max: 5 },
    image: { type: String, trim: true, maxlength: 300 },
};

const price = { type: Number, required: true, min: 0 };

// A place that offers a list of services, e.g. a repair shop or a bookstore
function createPlaceSchema() {
    return new mongoose.Schema(
        {
            ...placeFields,
            services: {
                type: [{ type: String, trim: true, maxlength: 120 }],
                default: [],
                validate: {
                    validator: (services) => services.length <= 20,
                    message: 'A listing can have at most 20 services',
                },
            },
        },
        { timestamps: true }
    );
}

// A place with a fixed price for each of the given services, e.g. a salon
function createPricedPlaceSchema(priceFields) {
    const fields = { ...placeFields };
    priceFields.forEach((field) => {
        fields[field] = price;
    });
    return new mongoose.Schema(fields, { timestamps: true });
}

exports.createPlaceSchema = createPlaceSchema;
exports.createPricedPlaceSchema = createPricedPlaceSchema;
