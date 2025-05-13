const { validationResult } = require('express-validator')
const mongoose = require('mongoose')
const HttpError = require('../../models/http-error')
const WomenSalonPlans = require("../../models/aesthetic/women-salon-plan")


// Get all Women-salonPlans 
async function getWomenSalonPlans(req, res, next) {
    try {
        const salonPlans = await WomenSalonPlans.find();
        res.json(salonPlans);
    } catch (error) {
        console.error("ناموفق در دریافت  :", error);
        res.status(500).json({ error: "Server error" });
    }
}

// Create a new Women-salons
async function createWomenSalonPlans(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError("ورودی نامعتبر ارسال شده است", 422));
    }

    const {
        title,
        faceCarePrice,
        hairBotoxPrice,
        hairColorPrice,
        makeupPrice,
        eyelashExtensionPrice,
        eyebrowShapePrice,
        eyebrowLiftPrice,
        nailExtensionPrice,
        manicurePrice,
        waxingPrice,
    } = req.body;
    // const imagePath = req.file?.path;
    const imagePath = req.body.image ? `uploads/images/${req.body.image}` : null;


    const newSalonPlan = new WomenSalonPlans({
        title,
        faceCarePrice,
        hairBotoxPrice,
        hairColorPrice,
        makeupPrice,
        eyelashExtensionPrice,
        eyebrowShapePrice,
        eyebrowLiftPrice,
        nailExtensionPrice,
        manicurePrice,
        waxingPrice,
        image: imagePath, // save the image path
    });

    try {
        await newSalonPlan.save();
    } catch (err) {
        return next(new HttpError("ایجاد تعرفه ناموفق بود", 500));
    }

    res.status(201).json({ newSalonPlan: newSalonPlan });
}


exports.getWomenSalonPlans = getWomenSalonPlans
exports.createWomenSalonPlans = createWomenSalonPlans
