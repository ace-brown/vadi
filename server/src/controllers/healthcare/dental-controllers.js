const { validationResult } = require('express-validator')
const mongoose = require('mongoose')
const HttpError = require('../../models/http-error')
const DentalService = require("../../models/healthcare/dental-service")


// Get all Dental services 
async function getDentalServices(req, res, next) {
    try {
        const plans = await DentalService.find();
        res.json(plans);
    } catch (error) {
        console.error("ناموفق در دریافت  :", error);
        res.status(500).json({ error: "Server error" });
    }
}

// Create a new Dental Service
async function createDentalService(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError("ورودی نامعتبر ارسال شده است", 422));
    }

    const { title, address, services } = req.body;
    // const imagePath = req.file?.path;
    const imagePath = req.body.image ? `uploads/images/${req.body.image}` : null;

    const newDentalService = new DentalService({
        title,
        address,
        services,
        image: imagePath,
    });

    try {
        await newDentalService.save();
    } catch (err) {
        return next(new HttpError("ایجاد ناموفق بود", 500));
    }

    res.status(201).json({ dentalService: newDentalService });
}

exports.getDentalServices = getDentalServices
exports.createDentalService = createDentalService
