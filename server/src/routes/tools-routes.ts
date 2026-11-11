import express from 'express';
import mongoose from 'mongoose';

import PriceHistory from '../models/price-history';
import HttpError from '../models/http-error';
import { OFFER_MODELS, isOfferKind } from '../models/internet/offer-models';
import { activeOfferFilter } from '../models/schemas/offer-schema';
import { asyncHandler } from '../controllers/resource-controllers';
import { adviseHome, adviseMobile } from '../advisor';
import { checkAddress } from '../availability';

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
    const { type } = req.params;
    if (!isOfferKind(type) || !mongoose.isValidObjectId(req.params.id)) throw new HttpError('Offer not found', 404);
    if (!(await OFFER_MODELS[type].exists({ $and: [{ _id: req.params.id }, activeOfferFilter()] }))) {
        throw new HttpError('Offer not found', 404);
    }
    const history = await PriceHistory.find({ offer: req.params.id })
        .select('effectiveMonthlyPrice monthlyPrice recordedAt -_id')
        .sort({ recordedAt: 1 })
        .limit(500);
    res.json({ history });
}));

export default router;
