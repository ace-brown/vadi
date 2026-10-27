const mongoose = require('mongoose');

// One "go to offer" click. Deliberately no IP address or user ID.
const clickSchema = new mongoose.Schema(
    {
        offerType: { type: String, required: true, enum: ['home', 'mobile'] },
        offer: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
        provider: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider' },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

clickSchema.index({ createdAt: -1 });

const Click = mongoose.model('Click', clickSchema);
module.exports = Click;
