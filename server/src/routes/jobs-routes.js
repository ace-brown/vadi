const express = require('express');
const crypto = require('crypto');

const checkAuth = require('../middleware/check-auth');
const checkAdmin = require('../middleware/check-admin');
const { asyncHandler } = require('../controllers/resource-controllers');
const { checkPriceAlerts } = require('../jobs/price-alerts');

const router = express.Router();

function hasCronSecret(req) {
    const secret = process.env.CRON_SECRET;
    const given = req.headers.authorization?.replace(/^Bearer /, '') ?? '';
    return !!secret && given.length === secret.length
        && crypto.timingSafeEqual(Buffer.from(given), Buffer.from(secret));
}

// Scheduled jobs are allowed with "Authorization: Bearer <CRON_SECRET>" (what Vercel
// Cron sends) or by an admin
function cronOrAdmin(req, res, next) {
    if (hasCronSecret(req)) return next();
    checkAuth(req, res, (err) => (err ? next(err) : checkAdmin(req, res, next)));
}

// GET or POST /api/jobs/price-alerts — email users whose target price was reached
router.all('/price-alerts', cronOrAdmin, asyncHandler(async (req, res) => {
    res.json(await checkPriceAlerts());
}));

module.exports = router;
