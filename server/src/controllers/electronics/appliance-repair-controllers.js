const { validationResult } = require('express-validator')
const mongoose = require('mongoose')
const HttpError = require('../../models/http-error')
const ApplianceRepair = require("../../models/electronics/appliance-repair")


// Get all Appliance Repair 
async function getApplianceRepair(req, res, next) {
    try {
        const plans = await ApplianceRepair.find();
        res.json(plans);
    } catch (error) {
        console.error("ناموفق در دریافت  :", error);
        res.status(500).json({ error: "Server error" });
    }
}

// Create a new Appliance Repair
async function createApplianceRepair(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError("ورودی نامعتبر ارسال شده است", 422));
    }

    const { title, address, services } = req.body;
    // const imagePath = req.file?.path;
    const imagePath = req.body.image ? `uploads/images/${req.body.image}` : null;

    const newPlan = new ApplianceRepair({
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

    res.status(201).json({ applianceRepair: newPlan });
}

exports.getApplianceRepair = getApplianceRepair
exports.createApplianceRepair = createApplianceRepair
