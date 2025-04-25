const mongoose = require("mongoose");

const IdeaSchema = new mongoose.Schema({
    ownerId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    reportId: { type: mongoose.Schema.Types.ObjectId, ref: 'Report' },
    fatherName: { type: String, required: true, trim: true },
    associate: { type: String, trim: true },
    country: { type: String, trim: true },
    state: { type: String, trim: true },
    city: { type: String, required: true, trim: true },
    career: { type: String, required: true, trim: true },
    maritalStatus: { type: String, },
    gender: { type: String, required: true, },
    mobileNumber: { type: String, required: true },
    age: { type: Number, required: true, min: 0 },
    branchOfStudy: { type: String, required: true, trim: true },
    branchDetail: { type: String, trim: true, },
    ideaTitle: { type: String, required: true, trim: true, },
    ideaDescription: { type: String, required: true, trim: true, },
    createdAt: { type: Date, default: Date.now },

});

const Idea = mongoose.model("Idea", IdeaSchema);

module.exports = Idea