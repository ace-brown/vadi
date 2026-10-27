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
        language: { type: String, default: 'en', enum: ['en', 'fa'] },
        notifications: { type: Boolean, default: true },
    },
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
