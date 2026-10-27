const express = require('express');
const mongoose = require('mongoose');

const HomeTariff = require('../models/internet/home-tariff');
const MobileTariff = require('../models/internet/mobile-tariff');
const Click = require('../models/click');
const HttpError = require('../models/http-error');
const checkAuth = require('../middleware/check-auth');
const checkAdmin = require('../middleware/check-admin');
const { activeOfferFilter } = require('../models/schemas/offer-schema');
const { asyncHandler } = require('../controllers/resource-controllers');

const OFFER_MODELS = { home: HomeTariff, mobile: MobileTariff };

const router = express.Router();

// GET /api/go/stats — clicks per offer over the last N days (admin)
router.get('/stats', checkAuth, checkAdmin, asyncHandler(async (req, res) => {
    const days = Math.min(365, Math.max(1, parseInt(req.query.days, 10) || 30));
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const stats = await Click.aggregate([
        { $match: { createdAt: { $gte: since } } },
        { $group: { _id: { offer: '$offer', offerType: '$offerType' }, clicks: { $sum: 1 } } },
        { $sort: { clicks: -1 } },
    ]);
    res.json({ days, stats: stats.map((row) => ({ ...row._id, clicks: row.clicks })) });
}));

// GET /api/go/:type/:id — log the click and send the visitor to the provider
router.get('/:type/:id', asyncHandler(async (req, res) => {
    const Model = OFFER_MODELS[req.params.type];
    if (!Model || !mongoose.isValidObjectId(req.params.id)) {
        throw new HttpError('Offer not found', 404);
    }
    const offer = await Model.findOne({ $and: [{ _id: req.params.id }, activeOfferFilter()] });
    if (!offer) {
        throw new HttpError('Offer not found', 404);
    }

    await Click.create({ offerType: req.params.type, offer: offer._id, provider: offer.providerId });

    res.set('Cache-Control', 'no-store');
    res.set('X-Robots-Tag', 'noindex, nofollow');
    if (offer.affiliateUrl) {
        return res.redirect(302, offer.affiliateUrl);
    }
    // Sample offers have no partner link yet: explain that on the website instead
    const clientUrl = (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/$/, '');
    const params = new URLSearchParams({ provider: offer.provider || '', offer: offer.name });
    res.redirect(302, `${clientUrl}/partner-redirect?${params}`);
}));

module.exports = router;
