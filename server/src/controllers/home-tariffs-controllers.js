const { validationResult } = require('express-validator')
const mongoose = require('mongoose')
const HttpError = require('../models/http-error')
const HomeTariff = require("../models/home-tariff")


// Get all home-tariffs 
async function getHomeTariffs(req, res, next) {
    try {
        const tariffs = await HomeTariff.find();
        res.json(tariffs);
    } catch (error) {
        console.error("ناموفق در دریافت تعرفه‌های :", error);
        res.status(500).json({ error: "Server error" });
    }
}

// Create a new home-tariff
async function createHomeTariff(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError("ورودی نامعتبر ارسال شده است", 422));
    }

    const { title, speed, duration, volume, netType, price } = req.body;
    // const imagePath = req.file?.path;
    const imagePath = req.body.image ? `uploads/images/${req.body.image}` : null;

    const newTariff = new HomeTariff({
        title,
        speed,
        duration,
        volume,
        netType,
        price,
        image: imagePath, // save the image path
    });

    try {
        await newTariff.save();
    } catch (err) {
        return next(new HttpError("ایجاد تعرفه ناموفق بود", 500));
    }

    res.status(201).json({ homeTariff: newTariff });
}

exports.getHomeTariffs = getHomeTariffs
exports.createHomeTariff = createHomeTariff
