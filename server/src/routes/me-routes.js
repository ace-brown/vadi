const express = require('express');
const mongoose = require('mongoose');

const User = require('../models/user');
const Review = require('../models/review');
const PriceAlert = require('../models/price-alert');
const HomeTariff = require('../models/internet/home-tariff');
const MobileTariff = require('../models/internet/mobile-tariff');
const HttpError = require('../models/http-error');
const checkAuth = require('../middleware/check-auth');
const { activeOfferFilter } = require('../models/schemas/offer-schema');
const { asyncHandler } = require('../controllers/resource-controllers');

// Everything here belongs to the logged-in user: /api/me/...
const OFFER_MODELS = { home: HomeTariff, mobile: MobileTariff };
const MAX_SAVED_OFFERS = 50;
const MAX_COMPARISONS = 20;
const PROVIDER_FIELDS = 'name slug logo rating';

const router = express.Router();
router.use(checkAuth);

async function currentUser(req) {
    const user = await User.findById(req.userData.userId);
    if (!user) throw new HttpError('User not found', 404);
    return user;
}

function offerModel(kind) {
    const Model = OFFER_MODELS[kind];
    if (!Model) throw new HttpError('Kind must be "home" or "mobile"', 400);
    return Model;
}

function checkId(id) {
    if (!mongoose.isValidObjectId(id)) throw new HttpError('Invalid offer ID', 400);
}

// Load offers of both kinds by ID, with their provider, and mark which are still bookable
async function loadOffers(refs) {
    const result = new Map();
    for (const [kind, Model] of Object.entries(OFFER_MODELS)) {
        const ids = refs.filter((ref) => ref.kind === kind).map((ref) => ref.offer);
        if (ids.length === 0) continue;
        const [offers, available] = await Promise.all([
            Model.find({ _id: { $in: ids } }).populate('providerId', PROVIDER_FIELDS),
            Model.find({ $and: [{ _id: { $in: ids } }, activeOfferFilter()] }).distinct('_id'),
        ]);
        const availableIds = new Set(available.map(String));
        offers.forEach((offer) => result.set(String(offer._id), { offer, available: availableIds.has(String(offer._id)) }));
    }
    return result;
}

// GET /api/me/saved-offers — watchlist with current prices
router.get('/saved-offers', asyncHandler(async (req, res) => {
    const user = await currentUser(req);
    const offers = await loadOffers(user.savedOffers);
    const items = [...user.savedOffers]
        .sort((a, b) => b.savedAt - a.savedAt)
        .map((saved) => {
            const found = offers.get(String(saved.offer));
            return {
                kind: saved.kind,
                offerId: saved.offer,
                savedPrice: saved.savedPrice,
                savedAt: saved.savedAt,
                // null when the offer was deleted
                offer: found ? found.offer : null,
                available: found ? found.available : false,
            };
        });
    res.json({ items });
}));

// PUT /api/me/saved-offers/:kind/:id — add to the watchlist (no-op if already saved)
router.put('/saved-offers/:kind/:id', asyncHandler(async (req, res) => {
    const Model = offerModel(req.params.kind);
    checkId(req.params.id);
    const offer = await Model.findOne({ $and: [{ _id: req.params.id }, activeOfferFilter()] });
    if (!offer) throw new HttpError('Offer not found', 404);

    const user = await currentUser(req);
    if (!user.savedOffers.some((saved) => String(saved.offer) === req.params.id)) {
        if (user.savedOffers.length >= MAX_SAVED_OFFERS) {
            throw new HttpError(`You can save up to ${MAX_SAVED_OFFERS} offers`, 422);
        }
        user.savedOffers.push({ kind: req.params.kind, offer: offer._id, savedPrice: offer.effectiveMonthlyPrice });
        await user.save();
    }
    res.json({ saved: user.savedOffers.map((saved) => String(saved.offer)) });
}));

// DELETE /api/me/saved-offers/:kind/:id
router.delete('/saved-offers/:kind/:id', asyncHandler(async (req, res) => {
    offerModel(req.params.kind);
    checkId(req.params.id);
    const user = await currentUser(req);
    user.savedOffers = user.savedOffers.filter((saved) => String(saved.offer) !== req.params.id);
    await user.save();
    res.json({ saved: user.savedOffers.map((saved) => String(saved.offer)) });
}));

// GET /api/me/comparisons — saved comparisons with a summary of each offer
router.get('/comparisons', asyncHandler(async (req, res) => {
    const user = await currentUser(req);
    const refs = user.comparisons.flatMap((comparison) =>
        comparison.offers.map((offer) => ({ kind: comparison.kind, offer }))
    );
    const offers = await loadOffers(refs);
    const items = [...user.comparisons]
        .sort((a, b) => b.createdAt - a.createdAt)
        .map((comparison) => ({
            _id: comparison._id,
            kind: comparison.kind,
            name: comparison.name,
            createdAt: comparison.createdAt,
            offers: comparison.offers.map((id) => {
                const found = offers.get(String(id));
                return found
                    ? { _id: id, name: found.offer.name, provider: found.offer.provider, effectiveMonthlyPrice: found.offer.effectiveMonthlyPrice, available: found.available }
                    : { _id: id, name: null, provider: null, effectiveMonthlyPrice: null, available: false };
            }),
        }));
    res.json({ items });
}));

// POST /api/me/comparisons — { kind, offerIds: [2–3 IDs], name? }
router.post('/comparisons', asyncHandler(async (req, res) => {
    const { kind, offerIds, name } = req.body;
    const Model = offerModel(kind);
    if (!Array.isArray(offerIds) || offerIds.length < 1 || offerIds.length > 3) {
        throw new HttpError('A comparison needs 1 to 3 offers', 422);
    }
    offerIds.forEach(checkId);
    if (await Model.countDocuments({ _id: { $in: offerIds } }) !== new Set(offerIds).size) {
        throw new HttpError('Some offers were not found', 404);
    }
    if (name !== undefined && (typeof name !== 'string' || name.length > 80)) {
        throw new HttpError('Name must be text of at most 80 characters', 422);
    }

    const user = await currentUser(req);
    if (user.comparisons.length >= MAX_COMPARISONS) {
        throw new HttpError(`You can save up to ${MAX_COMPARISONS} comparisons`, 422);
    }
    user.comparisons.push({ kind, offers: [...new Set(offerIds)], name: name?.trim() || undefined });
    await user.save();
    res.status(201).json({ comparison: user.comparisons[user.comparisons.length - 1] });
}));

// DELETE /api/me/comparisons/:id
router.delete('/comparisons/:id', asyncHandler(async (req, res) => {
    const user = await currentUser(req);
    const before = user.comparisons.length;
    user.comparisons = user.comparisons.filter((comparison) => String(comparison._id) !== req.params.id);
    if (user.comparisons.length === before) throw new HttpError('Comparison not found', 404);
    await user.save();
    res.json({ message: 'Deleted successfully' });
}));

// GET /api/me/price-alerts — alerts with the offer's current price
router.get('/price-alerts', asyncHandler(async (req, res) => {
    const alerts = await PriceAlert.find({ user: req.userData.userId }).sort({ createdAt: -1 });
    const offers = await loadOffers(alerts.map((alert) => ({ kind: alert.offerType, offer: alert.offer })));
    res.json({
        items: alerts.map((alert) => {
            const found = offers.get(String(alert.offer));
            return {
                kind: alert.offerType,
                offerId: alert.offer,
                targetPrice: alert.targetPrice,
                active: alert.active,
                triggeredAt: alert.triggeredAt,
                triggeredPrice: alert.triggeredPrice,
                offer: found ? found.offer : null,
                available: found ? found.available : false,
            };
        }),
    });
}));

// PUT /api/me/price-alerts/:kind/:id — { targetPrice }: create or update (and re-arm) an alert
router.put('/price-alerts/:kind/:id', asyncHandler(async (req, res) => {
    const Model = offerModel(req.params.kind);
    checkId(req.params.id);
    const targetPrice = Number(req.body?.targetPrice);
    if (!Number.isFinite(targetPrice) || targetPrice <= 0 || targetPrice > 1000) {
        throw new HttpError('targetPrice must be a number between 0 and 1000', 422);
    }
    if (!(await Model.exists({ $and: [{ _id: req.params.id }, activeOfferFilter()] }))) {
        throw new HttpError('Offer not found', 404);
    }
    const alert = await PriceAlert.findOneAndUpdate(
        { user: req.userData.userId, offer: req.params.id },
        {
            $set: { offerType: req.params.kind, targetPrice, active: true, triggeredAt: null, triggeredPrice: null },
        },
        { upsert: true, new: true, runValidators: true }
    );
    res.json({ alert });
}));

// DELETE /api/me/price-alerts/:kind/:id
router.delete('/price-alerts/:kind/:id', asyncHandler(async (req, res) => {
    offerModel(req.params.kind);
    checkId(req.params.id);
    await PriceAlert.deleteOne({ user: req.userData.userId, offer: req.params.id });
    res.json({ message: 'Deleted successfully' });
}));

// GET /api/me/reviews — the user's own reviews, including pending and rejected ones
router.get('/reviews', asyncHandler(async (req, res) => {
    const reviews = await Review.find({ user: req.userData.userId })
        .populate('provider', 'name')
        .sort({ createdAt: -1 });
    res.json({ reviews });
}));

module.exports = router;
