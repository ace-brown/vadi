const { validationResult } = require('express-validator')
const mongoose = require('mongoose')
const HttpError = require('../models/http-error')
const MobileTariff = require("../models/mobile-tariff")


// Get all mobile-tariffs 
async function getMobileTariffs(req, res, next) {
    try {
        const tariffs = await MobileTariff.find();
        res.json(tariffs);
    } catch (error) {
        console.error("ناموفق در دریافت تعرفه‌های موبایل:", error);
        res.status(500).json({ error: "Server error" });
    }
}

// Create a new mobile-tariff
async function createMobileTariff(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError(
                "ورودی نامعتبر ارسال شده است، لطفاً داده‌های خود را بررسی کنید",
                422
            )
        );
    }

    const { type, simPrice, validity, packagePrice, minutes, image } = req.body;

    const newTariff = new MobileTariff({
        type,
        simPrice,
        validity,
        packagePrice,
        minutes,
        image,
    });

    try {
        await newTariff.save();
    } catch (err) {
        console.error(err);
        return next(
            new HttpError(
                "ایجاد تعرفه ناموفق بود، لطفاً بعداً دوباره تلاش کنید",
                500
            )
        );
    }

    res.status(201).json({ mobileTariff: newTariff });
}

// try {
//     const sess = await mongoose.startSession();
//     sess.startTransaction();

//     // Save the idea and report within the same transaction
//     await createdIdea.save({ session: sess });
//     await createdReport.save({ session: sess });

//     // Link the report to the idea
//     createdIdea.reportId = createdReport._id;
//     await createdIdea.save({ session: sess });

//     // Update the user with the created idea and report
//     user.ideas.push(createdIdea);
//     user.reports.push(createdReport);
//     await user.save({ session: sess });

//     await sess.commitTransaction();
// } catch (err) {
//     console.log(err)
//     return next(new HttpError("ایجاد ایده و گزارش ناموفق بود، لطفاً بعداً دوباره تلاش کنید", 500));
// }



// Update a specific idea
async function updateIdea(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new HttpError("ورودی نامعتبر ارسال شده است، لطفاً داده‌های خود را بررسی کنید", 422);
    }

    const ideaId = req.params.eid;
    const updates = req.body;

    try {
        if (!mongoose.Types.ObjectId.isValid(ideaId)) {
            return next(new HttpError("شناسه ایده نامعتبر است", 400));
        }

        const idea = await Idea.findById(ideaId);
        if (!idea) {
            return next(new HttpError("نتوانستیم ایده‌ای برای شناسه ارائه شده پیدا کنیم", 404));
        }

        // Check if the idea is for the user
        // if (idea.creator !== req.userData.userId) {
        //     const error = new HttpError(
        //         'You are not allowed to edit this idea.',
        //         401
        //     );
        //     return next(error);
        // }

        // Check if ideaTitle is being updated
        if (updates.ideaTitle && updates.ideaTitle !== idea.ideaTitle) {
            const report = await Report.findOne({ ideaId: idea._id });
            if (report) {
                report.ideaTitle = updates.ideaTitle;
                await report.save();
            }
        }

        // Update the Idea document
        const updatedIdea = await Idea.findByIdAndUpdate(
            ideaId,
            updates,
            { new: true, runValidators: true }
        );

        res.status(200).json({ idea: updatedIdea.toObject({ getters: true }) });
    } catch (error) {
        console.error(error);
        return next(new HttpError("بروزرسانی ایده ناموفق بود، لطفاً بعداً دوباره تلاش کنید", 500));
    }
}

// Delete a specific idea
async function deleteIdea(req, res, next) {
    const ideaId = req.params.eid;

    let idea;
    try {
        idea = await Idea.findById(ideaId).populate('ownerId');
    } catch (err) {
        return next(new HttpError("مشکلی پیش آمده است، نتوانستیم ایده را حذف کنیم", 500));
    }

    if (!idea) {
        return next(new HttpError("نتوانستیم ایده‌ای برای شناسه ارائه شده پیدا کنیم", 404));
    }

    let report;
    try {
        report = await Report.findOne({ ideaId: idea._id }).populate('ownerId');
    } catch (err) {
        return next(new HttpError("مشکلی پیش آمده است، نتوانستیم ایده را حذف کنیم", 500));
    }


    try {
        const sess = await mongoose.startSession()
        sess.startTransaction()

        // Delete the idea and report
        await idea.deleteOne({ session: sess });
        await report.deleteOne({ session: sess });

        // Update the user with the deleted idea and report
        idea.ownerId.ideas.pull(idea._id)
        report.ownerId.reports.pull(report._id)

        await idea.ownerId.save({ session: sess });
        await report.ownerId.save({ session: sess });
        await sess.commitTransaction()
    } catch (err) {
        await sess.abortTransaction();
        return next(new HttpError("حذف ایده ناموفق بود", 500));
    }

    res.status(200).json(
        {
            message: `idea with ideaId ${idea._id} and report with reportId ${report._id} deleted successfully.`
        });

}


exports.getMobileTariffs = getMobileTariffs
exports.createMobileTariff = createMobileTariff
exports.updateIdea = updateIdea
exports.deleteIdea = deleteIdea