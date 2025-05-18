const { validationResult } = require('express-validator')
const mongoose = require('mongoose')
const HttpError = require('../../models/http-error')
const AnimalBasedProducts = require("../../models/agriculture/animal-based-products")


// Get all Animal Based Products
async function getAnimalBasedProducts(req, res, next) {
    try {
        const plans = await AnimalBasedProducts.find();
        res.json(plans);
    } catch (error) {
        console.error("ناموفق در دریافت  :", error);
        res.status(500).json({ error: "Server error" });
    }
}

// Create a new Animal Based Product
async function createAnimalBasedProducts(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError("ورودی نامعتبر ارسال شده است", 422));
    }

    const { title, address, services } = req.body;
    // const imagePath = req.file?.path;
    const imagePath = req.body.image ? `uploads/images/${req.body.image}` : null;

    const newPlan = new AnimalBasedProducts({
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

    res.status(201).json({ animalBasedProducts: newPlan });
}

exports.getAnimalBasedProducts = getAnimalBasedProducts
exports.createAnimalBasedProducts = createAnimalBasedProducts
