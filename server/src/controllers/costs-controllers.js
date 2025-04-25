const { validationResult } = require('express-validator')
const mongoose = require('mongoose')

const HttpError = require('../models/http-error')
const { Cost, predefinedServices } = require('../models/cost')

// Get a spesific cost by a specific cost id 
async function getCostById(req, res, next) {
    const costId = req.params.cid;

    let cost;
    try {
        cost = await Cost.findById(costId);
    } catch (err) {
        return next(new HttpError("مشکلی پیش آمده است، نتوانستیم هزینه را پیدا کنیم", 500))
    }

    if (!cost) {
        return next(new HttpError("نتوانستیم هزینه‌ای برای شناسه ارائه شده پیدا کنیم", 404))
    }

    res.json({ cost: cost.toObject({ getters: true }) })
}

// Get all cost for a specific user with a userId
async function getCostsByUserId(req, res, next) {
    const userId = req.params.uid;

    let costsForUser;
    try {
        costsForUser = await Cost.find({ userId: userId })
    } catch (err) {
        return next(new HttpError("دریافت هزینه‌ها ناموفق بود، لطفاً بعداً دوباره تلاش کنید", 500))
    }

    if (!costsForUser || costsForUser.length === 0) {
        return next(new HttpError("نتوانستیم هزینه‌ها را برای شناسه کاربری ارائه شده پیدا کنیم", 404))
    }

    res.json({ costsForUser: costsForUser.map(c => c.toObject({ getters: true })) })
}

// Create a new cost
async function createCost(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ message: "ورودی نامعتبر ارسال شده است، لطفاً داده‌های خود را بررسی کنید" });
    }

    const { userId, reportId, selectedServices, paid } = req.body;

    try {
        // Validate selectedServices (must be from predefinedServices)
        if (!Array.isArray(selectedServices) || selectedServices.length === 0) {
            return res.status(400).json({ message: "خدمات انتخاب شده باید یک آرایه غیر خالی باشد" });
        }

        // Validate and map the selected services
        const validatedServices = selectedServices.map((service) => {
            const predefinedService = predefinedServices.find(
                (s) => s.serviceName === service.serviceName
            );
            if (!predefinedService) {
                throw new Error(`Invalid service: ${service.serviceName}`);
            }
            return {
                serviceName: predefinedService.serviceName,
                price: service.price ?? predefinedService.price,
                expert: service.expert || predefinedService.expert,
            };
        });

        // Check if a cost entry for the reportId already exists
        const existingCost = await Cost.findOne({ reportId });

        if (existingCost) {
            // Check for duplicates in the existing selectedServices
            const duplicateService = validatedServices.find((service) =>
                existingCost.selectedServices.some(
                    (existingService) => existingService.serviceName === service.serviceName
                )
            );

            if (duplicateService) {
                return res.status(400).json({
                    message: `خدمات "${duplicateService.serviceName}" قبلاً در هزینه موجود است.`,
                });
            }

            // Add the new services to the existing cost
            existingCost.selectedServices.push(...validatedServices);

            // Update the `paid` status only if provided in the request
            if (typeof paid === "boolean") {
                existingCost.paid = paid;
            }

            // Save the updated cost document
            await existingCost.save();
            return res.status(200).json({
                message: "خدمات با موفقیت به هزینه موجود اضافه شدند",
                cost: existingCost,
            });
        } else {
            // If no existing cost, create a new cost entry
            const newCost = new Cost({
                userId,
                reportId,
                selectedServices: validatedServices,
                paid: typeof paid === "boolean" ? paid : false,
            });

            await newCost.save();
            return res.status(201).json({
                message: "هزینه با موفقیت ایجاد شد",
                cost: newCost,
            });
        }
    } catch (err) {
        console.error(err);
        return next(new HttpError("ایجاد هزینه ناموفق بود، لطفاً بعداً دوباره تلاش کنید", 500));
    }
}

// Update a specific cost
async function updateCost(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(new HttpError("ورودی نامعتبر ارسال شده است، لطفاً داده‌های خود را بررسی کنید", 422));
    }

    const costId = req.params.cid;
    const { selectedServices } = req.body;

    // Validate costId format
    if (!mongoose.Types.ObjectId.isValid(costId)) {
        return res.status(400).json({ message: "فرمت شناسه هزینه نامعتبر است" });
    }

    try {
        const cost = await Cost.findById(costId);
        if (!cost) {
            return res.status(404).json({ message: "هزینه پیدا نشد" });
        }

        if (selectedServices && Array.isArray(selectedServices)) {
            // Validate and map the selected services
            const validatedServices = selectedServices.map((selectedService) => {
                const predefinedService = predefinedServices.find(
                    (s) => s.serviceName === selectedService.serviceName
                );

                if (!predefinedService) {
                    throw new Error(`Invalid service: ${selectedService.serviceName}`);
                }

                return {
                    serviceName: predefinedService.serviceName,
                    price: selectedService.price ?? predefinedService.price,
                    expert: selectedService.expert || predefinedService.expert,
                    paid: selectedService.paid ?? false, // Default to false if not provided
                };
            });

            // Replace existing services or update them
            validatedServices.forEach((newService) => {
                const existingIndex = cost.selectedServices.findIndex(
                    (existingService) =>
                        existingService.serviceName === newService.serviceName
                );

                if (existingIndex !== -1) {
                    // Update the existing service
                    cost.selectedServices[existingIndex] = {
                        ...cost.selectedServices[existingIndex],
                        ...newService,
                    };
                } else {
                    // Remove the old service (if any) and add the new service
                    cost.selectedServices = cost.selectedServices.filter(
                        (existingService) =>
                            !selectedServices.some(
                                (s) =>
                                    s.serviceName !== existingService.serviceName &&
                                    existingService.price === s.price &&
                                    existingService.expert === s.expert
                            )
                    );
                    cost.selectedServices.push(newService);
                }
            });
        }

        // Save the updated cost
        await cost.save();

        res.status(200).json({ message: "هزینه با موفقیت بروزرسانی شد", cost });
    } catch (err) {
        console.error(err);
        return next(new HttpError("بروزرسانی هزینه ناموفق بود، لطفاً بعداً دوباره تلاش کنید", 500));
    }
}



exports.getCostById = getCostById
exports.getCostsByUserId = getCostsByUserId
exports.createCost = createCost
exports.updateCost = updateCost