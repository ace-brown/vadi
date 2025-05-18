const { validationResult } = require('express-validator')
const mongoose = require('mongoose')
const HttpError = require('../../models/http-error')
const GardenSupplies = require("../../models/agriculture/garden-supplies")

// Get all Garden Supplies 
async function getGardenSupplies(req, res, next) {
    try {
        const plans = await GardenSupplies.find();
        res.json(plans);
    } catch (error) {
        console.error("ناموفق در دریافت  :", error);
        res.status(500).json({ error: "Server error" });
    }
}

// Create a new Garden Supplie
async function createGardenSupplies(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError("ورودی نامعتبر ارسال شده است", 422));
    }

    const { title, address, services } = req.body;
    // const imagePath = req.file?.path;
    const imagePath = req.body.image ? `uploads/images/${req.body.image}` : null;

    const newPlan = new GardenSupplies({
        title,
        address,
        services,
        image: imagePath,
    });

    try {
        await newPlan.save();
    } catch (err) {
        return next(new HttpError("ایجاد ناموفق بود", 500));
    }

    res.status(201).json({ gardenSupplies: newPlan });
}

exports.getGardenSupplies = getGardenSupplies
exports.createGardenSupplies = createGardenSupplies
