const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, minlength: 3 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, default: 'user', enum: ['user', 'admin'] },
    createdAt: { type: Date, default: Date.now },
    profile: {
        fullName: { type: String, required: true },
        bio: { type: String, maxlength: 1000 },
        avatar: { type: String },
    },
    settings: {
        language: { type: String, default: 'de', enum: ['de', 'en'] },
        notifications: { type: Boolean, default: true },
    },
    // Watchlist: offers the user saved, with the effective price at the time
    savedOffers: [{
        _id: false,
        kind: { type: String, required: true, enum: ['home', 'mobile'] },
        offer: { type: mongoose.Schema.Types.ObjectId, required: true },
        savedPrice: { type: Number, required: true },
        savedAt: { type: Date, default: Date.now },
    }],
    // Saved side-by-side comparisons
    comparisons: [{
        kind: { type: String, required: true, enum: ['home', 'mobile'] },
        offers: [{ type: mongoose.Schema.Types.ObjectId }],
        name: { type: String, trim: true, maxlength: 80 },
        createdAt: { type: Date, default: Date.now },
    }],
});

// Never send the password hash to clients
function hidePassword(doc, ret) {
    delete ret.password;
    return ret;
}
userSchema.set('toJSON', { transform: hidePassword });
userSchema.set('toObject', { transform: hidePassword });

const User = mongoose.model('User', userSchema);

module.exports = User;
