const { validationResult } = require('express-validator')
const mongoose = require('mongoose')
const HttpError = require('../../models/http-error')
const AutoRepair = require("../../models/vehicle/auto-repair")


// Get all Auto Repair 
async function getAutoRepair(req, res, next) {
    try {
        const plans = await AutoRepair.find();
        res.json(plans);
    } catch (error) {
        console.error("ناموفق در دریافت  :", error);
        res.status(500).json({ error: "Server error" });
    }
}

// Create a new Auto Repair
async function createAutoRepair(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError("ورودی نامعتبر ارسال شده است", 422));
    }

    const { title, address, services } = req.body;
    // const imagePath = req.file?.path;
    const imagePath = req.body.image ? `uploads/images/${req.body.image}` : null;

    const newPlan = new AutoRepair({
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

    res.status(201).json({ autoRepair: newPlan });
}

exports.getAutoRepair = getAutoRepair
exports.createAutoRepair = createAutoRepair
