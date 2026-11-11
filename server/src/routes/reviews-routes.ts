import express from 'express';
import mongoose from 'mongoose';
import { check, validationResult } from 'express-validator';

import Review, { type ReviewStatus } from '../models/review';
import Provider from '../models/provider';
import User from '../models/user';
import HttpError from '../models/http-error';
import checkAuth from '../middleware/check-auth';
import checkAdmin from '../middleware/check-admin';
import { asyncHandler } from '../controllers/resource-controllers';

const STATUSES: ReviewStatus[] = ['pending', 'approved', 'rejected'];

function isStatus(value: unknown): value is ReviewStatus {
    return STATUSES.includes(value as ReviewStatus);
}

const router = express.Router();

function checkId(id: unknown, name = 'ID'): void {
    if (!mongoose.isValidObjectId(id)) {
        throw new HttpError(`Invalid ${name}`, 400);
    }
}

// GET /api/reviews?provider=<id> — approved reviews of a provider, with a summary
router.get('/', asyncHandler(async (req, res) => {
    checkId(req.query.provider, 'provider ID');
    const provider = new mongoose.Types.ObjectId(String(req.query.provider));

    const [reviews, [summary]] = await Promise.all([
        Review.find({ provider, status: 'approved' })
            .select('authorName rating title text createdAt')
            .sort({ createdAt: -1 })
            .limit(50),
        Review.aggregate<{ count: number; average: number }>([
            { $match: { provider, status: 'approved' } },
            { $group: { _id: null, count: { $sum: 1 }, average: { $avg: '$rating' } } },
        ]),
    ]);

    res.json({
        reviews,
        count: summary?.count ?? 0,
        average: summary ? Math.round(summary.average * 10) / 10 : null,
    });
}));

// POST /api/reviews — write a review (logged in); it is published after moderation
router.post('/', checkAuth, [
    check('provider').custom((value) => mongoose.isValidObjectId(value)),
    check('rating').isInt({ min: 1, max: 5 }).toInt(),
    check('title').optional().isString().trim().isLength({ max: 100 }),
    check('text').isString().trim().isLength({ min: 10, max: 2000 }),
], asyncHandler(async (req, res) => {
    if (!validationResult(req).isEmpty()) {
        throw new HttpError('Invalid input, please check your data.', 422);
    }
    const { provider, rating, title, text } = req.body;
    const { userId } = req.userData!; // set by checkAuth

    const [providerExists, user, existing] = await Promise.all([
        Provider.exists({ _id: provider }),
        User.findById(userId),
        Review.exists({ provider, user: userId }),
    ]);
    if (!providerExists) throw new HttpError('Provider not found', 404);
    if (!user) throw new HttpError('User not found', 404);
    if (existing) throw new HttpError('You have already reviewed this provider', 409);

    const review = await Review.create({
        provider,
        user: user._id,
        authorName: user.profile.fullName,
        rating,
        title,
        text,
    });
    res.status(201).json({ review, message: 'Thanks! Your review will appear once it has been checked.' });
}));

// GET /api/reviews/moderation?status=pending — reviews to moderate (admin)
router.get('/moderation', checkAuth, checkAdmin, asyncHandler(async (req, res) => {
    const status = isStatus(req.query.status) ? req.query.status : 'pending';
    const reviews = await Review.find({ status })
        .populate('provider', 'name')
        .sort({ createdAt: 1 })
        .limit(100);
    res.json({ reviews });
}));

// PATCH /api/reviews/:id — approve or reject (admin)
router.patch('/:id', checkAuth, checkAdmin, asyncHandler(async (req, res) => {
    checkId(req.params.id);
    const { status } = req.body;
    if (!isStatus(status)) {
        throw new HttpError('Status must be pending, approved or rejected', 422);
    }
    const review = await Review.findById(req.params.id);
    if (!review) throw new HttpError('Review not found', 404);
    review.status = status;
    await review.save();
    res.json({ review });
}));

// DELETE /api/reviews/:id (admin)
router.delete('/:id', checkAuth, checkAdmin, asyncHandler(async (req, res) => {
    checkId(req.params.id);
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) throw new HttpError('Review not found', 404);
    res.json({ message: 'Deleted successfully' });
}));

export default router;
