const mongoose = require('mongoose');

// Cached result of an address availability check, kept for 7 days
const availabilityCheckSchema = new mongoose.Schema({
    addressKey: { type: String, required: true, unique: true },
    results: { type: Array, default: [] },
    checkedAt: { type: Date, default: Date.now, expires: 7 * 24 * 60 * 60 },
});

module.exports = mongoose.model('AvailabilityCheck', availabilityCheckSchema);
