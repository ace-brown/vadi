const mongoose = require('mongoose');

// A customer review of a provider. New reviews wait for an admin to approve them.
const reviewSchema = new mongoose.Schema(
    {
        provider: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        // Name shown with the review, copied when it is written
        authorName: { type: String, required: true, trim: true, maxlength: 100 },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
            validate: { validator: Number.isInteger, message: 'Rating must be a whole number' },
        },
        title: { type: String, trim: true, maxlength: 100 },
        text: { type: String, required: true, trim: true, minlength: 10, maxlength: 2000 },
        status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending', index: true },
    },
    { timestamps: true }
);

// One review per user and provider
reviewSchema.index({ provider: 1, user: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
