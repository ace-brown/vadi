const { validationResult } = require('express-validator')
const mongoose = require('mongoose')

const HttpError = require('../models/http-error')
const { Report, defaultStages } = require('../models/report')
const User = require('../models/user')
const Idea = require('../models/idea')


// Get a spesific report by a specific id 
async function getReportById(req, res, next) {
    const reportId = req.params.rid;

    let report;
    try {
        report = await Report.findById(reportId);
    } catch (err) {
        return next(new HttpError("مشکلی پیش آمده است، نتوانستیم گزارش را پیدا کنیم", 500))
    }

    if (!report) {
        return next(new HttpError("نتوانستیم گزارشی برای شناسه ارائه شده پیدا کنیم", 404))
    }

    res.json({ report: report.toObject({ getters: true }) })
}

// Get all reports for a specific user with a userId
// async function getReportsByUserId(req, res, next) {
//     const userId = req.params.uid;

//     let reportsForUser;
//     try {
//         reportsForUser = await Report.find({ ownerId: userId })
//     } catch (err) {
//         return next(new HttpError("Fetching reports faild, please try again later", 500))
//     }

//     if (!reportsForUser || reportsForUser.length === 0) {
//         return next(new HttpError("Could not find reports for the provided user id", 404))
//     }

//     res.json({ reportsForUser: reportsForUser.map(r => r.toObject({ getters: true })) })
// }

// Create a new report
async function createReport(req, res, next) {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        throw new HttpError("ورودی نامعتبر ارسال شده است، لطفاً داده‌های خود را بررسی کنید", 422)
    }

    const { ideaTitle, ownerId } = req.body;

    const createdReport = new Report({
        ideaTitle,
        ownerId,
        stages: defaultStages,
    });

    let user;
    try {
        user = await User.findById(ownerId);
    } catch (err) {
        return next(new HttpError("ایجاد گزارش ناموفق بود، لطفاً دوباره تلاش کنید", 404))
    }

    if (!user) {
        return next(new HttpError("کاربر پیدا نشد، لطفاً شناسه کاربری را بررسی کنید", 404))
    }

    try {
        const sess = await mongoose.startSession()
        sess.startTransaction()
        await createdReport.save({ session: sess });
        user.reports.push(createdReport)
        await user.save({ session: sess })
        await sess.commitTransaction()
    } catch (err) {
        return next(new HttpError("ایجاد گزارش ناموفق بود، لطفاً بعداً دوباره امتحان کنید", 500))
    }

    res.status(201).json({ report: createdReport });
}

// Update a specific report
async function updateReport(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new HttpError("ورودی نامعتبر ارسال شد، لطفاً داده‌های خود را بررسی کنید", 422);
    }

    const reportId = req.params.rid;
    const updates = req.body;

    try {
        if (!mongoose.Types.ObjectId.isValid(reportId)) {
            return next(new HttpError("Invalid report ID", 400));
        }

        const report = await Report.findById(reportId);
        if (!report) {
            return next(new HttpError("گزارشی برای شناسه ارائه شده یافت نشد", 404));
        }

        // Check if ideaTitle is being updated
        if (updates.ideaTitle && updates.ideaTitle !== report.ideaTitle) {
            const idea = await Idea.findById(report.ideaId);
            if (idea) {
                idea.ideaTitle = updates.ideaTitle;
                await idea.save();
            }
        }

        // Update the Report document
        const updatedReport = await Report.findByIdAndUpdate(
            reportId,
            updates,
            { new: true, runValidators: true }
        );

        res.status(200).json({ report: updatedReport.toObject({ getters: true }) });
    } catch (error) {
        console.error(error);
        return next(new HttpError("به‌روزرسانی گزارش انجام نشد، لطفاً بعداً دوباره امتحان کنید", 500));
    }
}

// async function updateReport(req, res, next) {
//     const errors = validationResult(req)
//     if (!errors.isEmpty()) {
//         throw new HttpError("Invalid input passed, please check your data", 422)
//     }

//     const reportId = req.params.rid;
//     const updates = req.body;

//     try {
//         if (!mongoose.Types.ObjectId.isValid(reportId)) {
//             return next(new HttpError("Invalid report ID", 400));
//         }

//         const updatedReport = await Report.findByIdAndUpdate(
//             reportId,
//             updates,
//             { new: true, runValidators: true }
//         );

//         if (!updatedReport) {
//             return next(new HttpError("Could not find a report for the provided ID", 404));
//         }

//         res.status(200).json({ report: updatedReport.toObject({ getters: true }) });

//     } catch (error) {
//         return next(new HttpError("Updating report failed, please try again later.", 500));
//     }
// }

// Delete a specific report
// Note: for deleting a reoprt its idea must be deleted as well
// async function deleteReport(req, res, next) {
//     const reportId = req.params.rid;

//     let report;
//     try {
//         report = await Report.findById(reportId).populate('ownerId');
//     } catch (err) {
//         return next(new HttpError("Something went wrong, could not delete report.", 500));
//     }

//     if (!report) {
//         return next(new HttpError("Could not find a report for the provided id", 404));
//     }

//     try {
//         const sess = await mongoose.startSession()
//         sess.startTransaction()
//         await report.deleteOne({ _id: report._id }, { session: sess });
//         report.ownerId.reports.pull(report._id)
//         await report.ownerId.save({ session: sess });
//         await sess.commitTransaction()
//     } catch (err) {
//         return next(new HttpError("Deleting report failed.", 500));
//     }

//     res.status(200).json({ message: "Report deleted successfully." });

// }


exports.getReportById = getReportById
exports.createReport = createReport
exports.updateReport = updateReport
// exports.getReportsByUserId = getReportsByUserId
// exports.deleteReport = deleteReport