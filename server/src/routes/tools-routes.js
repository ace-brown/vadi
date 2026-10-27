const express = require('express');
const mongoose = require('mongoose');

const HomeTariff = require('../models/internet/home-tariff');
const MobileTariff = require('../models/internet/mobile-tariff');
const PriceHistory = require('../models/price-history');
const HttpError = require('../models/http-error');
const { activeOfferFilter } = require('../models/schemas/offer-schema');
const { asyncHandler } = require('../controllers/resource-controllers');
const { adviseHome, adviseMobile } = require('../advisor');
const { checkAddress } = require('../availability');

const OFFER_MODELS = { home: HomeTariff, mobile: MobileTariff };

const router = express.Router();

// POST /api/advisor/mobile and /api/advisor/home — needs-based recommendations
router.post('/advisor/mobile', asyncHandler(async (req, res) => {
    res.json(await adviseMobile(req.body ?? {}));
}));
router.post('/advisor/home', asyncHandler(async (req, res) => {
    res.json(await adviseHome(req.body ?? {}));
}));

// POST /api/availability — { postcode, street, houseNumber }: what each provider offers at the address
router.post('/availability', asyncHandler(async (req, res) => {
    const { address, results, checkedAt, cached } = await checkAddress(req.body ?? {});
    res.json({ address, checkedAt, cached, providers: results });
}));

// GET /api/price-history/:type/:id — effective price over time
router.get('/price-history/:type/:id', asyncHandler(async (req, res) => {
    const Model = OFFER_MODELS[req.params.type];
    if (!Model || !mongoose.isValidObjectId(req.params.id)) throw new HttpError('Offer not found', 404);
    if (!(await Model.exists({ $and: [{ _id: req.params.id }, activeOfferFilter()] }))) {
        throw new HttpError('Offer not found', 404);
    }
    const history = await PriceHistory.find({ offer: req.params.id })
        .select('effectiveMonthlyPrice monthlyPrice recordedAt -_id')
        .sort({ recordedAt: 1 })
        .limit(500);
    res.json({ history });
}));

module.exports = router;
