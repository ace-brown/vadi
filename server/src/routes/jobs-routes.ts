import express, { type Request, type RequestHandler } from 'express';
import crypto from 'crypto';

import checkAuth from '../middleware/check-auth';
import checkAdmin from '../middleware/check-admin';
import { asyncHandler } from '../controllers/resource-controllers';
import { checkPriceAlerts } from '../jobs/price-alerts';

const router = express.Router();

function hasCronSecret(req: Request): boolean {
    const secret = process.env.CRON_SECRET;
    const given = req.headers.authorization?.replace(/^Bearer /, '') ?? '';
    return !!secret && given.length === secret.length
        && crypto.timingSafeEqual(Buffer.from(given), Buffer.from(secret));
}

// Scheduled jobs are allowed with "Authorization: Bearer <CRON_SECRET>" (what Vercel
// Cron sends) or by an admin
const cronOrAdmin: RequestHandler = (req, res, next) => {
    if (hasCronSecret(req)) return next();
    checkAuth(req, res, (err?: unknown) => (err ? next(err) : checkAdmin(req, res, next)));
};

// GET or POST /api/jobs/price-alerts — email users whose target price was reached
router.all('/price-alerts', cronOrAdmin, asyncHandler(async (_req, res) => {
    res.json(await checkPriceAlerts());
}));

export default router;
