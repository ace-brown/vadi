const { validationResult } = require('express-validator')
const mongoose = require('mongoose')
const HttpError = require('../../models/http-error')
const EduCenter = require("../../models/education/education-center")


// Get all Education Centers
async function getEduCenters(req, res, next) {
    try {
        const centers = await EduCenter.find();
        res.json(centers);
    } catch (error) {
        console.error("ناموفق در دریافت  :", error);
        res.status(500).json({ error: "Server error" });
    }
}

// Create a new Education Center
async function createEduCenter(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError("ورودی نامعتبر ارسال شده است", 422));
    }

    const { title, address, services } = req.body;
    // const imagePath = req.file?.path;
    const imagePath = req.body.image ? `uploads/images/${req.body.image}` : null;

    const newCenter = new EduCenter({
        title,
        address,
        services,
        image: imagePath,
    });

    try {
        await newCenter.save();
    } catch (err) {
        return next(new HttpError("ایجاد ناموفق بود", 500));
    }

    res.status(201).json({ eduCenter: newCenter });
}

exports.getEduCenters = getEduCenters
exports.createEduCenter = createEduCenter
