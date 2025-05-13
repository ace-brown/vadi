const { validationResult } = require('express-validator')
const mongoose = require('mongoose')
const HttpError = require('../../models/http-error')
const MenSalonPlans = require("../../models/aesthetic/men-salon-plan")


// Get all men-salonPlans 
async function getMenSalonPlans(req, res, next) {
    try {
        const salonPlans = await MenSalonPlans.find();
        res.json(salonPlans);
    } catch (error) {
        console.error("ناموفق در دریافت تعرفه‌های موبایل:", error);
        res.status(500).json({ error: "Server error" });
    }
}

// Create a new men-salons
async function createMenSalonPlans(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError("ورودی نامعتبر ارسال شده است", 422));
    }

    const { title, haircutPrice, menLiftPrice, groomMakeupPrice, curlyHairDoPrice } = req.body;
    // const imagePath = req.file?.path;
    const imagePath = req.body.image ? `uploads/images/${req.body.image}` : null;


    const newSalonPlan = new MenSalonPlans({
        title,
        haircutPrice,
        menLiftPrice,
        groomMakeupPrice,
        curlyHairDoPrice,
        image: imagePath, // save the image path
    });

    try {
        await newSalonPlan.save();
    } catch (err) {
        return next(new HttpError("ایجاد تعرفه ناموفق بود", 500));
    }

    res.status(201).json({ newSalonPlan: newSalonPlan });
}


exports.getMenSalonPlans = getMenSalonPlans
exports.createMenSalonPlans = createMenSalonPlans
