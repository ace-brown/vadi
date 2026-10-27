const HomeTariff = require('./models/internet/home-tariff');
const MobileTariff = require('./models/internet/mobile-tariff');
require('./models/provider'); // populated when scoring
const { activeOfferFilter } = require('./models/schemas/offer-schema');

// How much each part counts towards the Vadi score. Published on the
// "How we compare" page, so keep the two in sync.
const SCORE_WEIGHTS = { price: 0.5, performance: 0.3, flexibility: 0.1, provider: 0.1 };

const MODELS = { home: HomeTariff, mobile: MobileTariff };
const TERM_FLEXIBILITY = { 1: 100, 12: 60, 24: 30 };

function round1(value) {
    return Math.round(value * 10) / 10;
}

// Scale values to 0–100 across the set; `higherIsBetter` decides the direction
function normalize(values, higherIsBetter) {
    const min = Math.min(...values);
    const max = Math.max(...values);
    return values.map((value) => {
        if (max === min) return 100;
        const share = (value - min) / (max - min);
        return Math.round((higherIsBetter ? share : 1 - share) * 100);
    });
}

// Performance before normalizing: speed for home internet; data, network and calls for mobile.
// Logarithms, because going from 16 to 100 Mbit/s matters more than from 500 to 1000.
function rawPerformance(kind, offer, maxData) {
    if (kind === 'home') {
        return 0.8 * Math.log2(offer.downloadMbps + 1) + 0.2 * Math.log2(offer.uploadMbps + 1);
    }
    const data = offer.dataGB === null ? maxData * 2 : offer.dataGB; // unlimited beats every limit
    return Math.log2(data + 1) + (offer.network === '5G' ? 1 : 0) + (offer.minutes === null ? 0.5 : 0);
}

// Grade from 1.0 (best) to 5.0 (worst) from a 0–100 total
function toGrade(total) {
    return Math.min(5, Math.max(1, round1(1 + 4 * (1 - total / 100))));
}

// Recalculate the score of every offer of one kind. Scores are relative to the
// other active offers, so they all change when one offer changes.
async function recomputeScores(kind) {
    const Model = MODELS[kind];
    const offers = await Model.find(activeOfferFilter()).populate('providerId', 'rating');

    // Inactive or expired offers have no score
    await Model.updateMany(
        { _id: { $nin: offers.map((offer) => offer._id) } },
        { $set: { score: null, scoreDetails: null } }
    );
    if (offers.length === 0) return;

    const maxData = Math.max(1, ...offers.map((offer) => offer.dataGB ?? 0));
    const price = normalize(offers.map((offer) => offer.effectiveMonthlyPrice), false);
    const performance = normalize(offers.map((offer) => rawPerformance(kind, offer, maxData)), true);

    await Model.bulkWrite(
        offers.map((offer, i) => {
            const details = {
                price: price[i],
                performance: performance[i],
                flexibility: TERM_FLEXIBILITY[offer.termMonths] ?? 30,
                provider: offer.providerId?.rating !== undefined && offer.providerId?.rating !== null
                    ? Math.round((offer.providerId.rating / 5) * 100)
                    : 50,
            };
            const total = Object.entries(SCORE_WEIGHTS).reduce((sum, [part, weight]) => sum + details[part] * weight, 0);
            return {
                updateOne: {
                    filter: { _id: offer._id },
                    update: { $set: { score: toGrade(total), scoreDetails: details } },
                },
            };
        })
    );
}

async function recomputeAllScores() {
    await recomputeScores('home');
    await recomputeScores('mobile');
}

exports.SCORE_WEIGHTS = SCORE_WEIGHTS;
exports.recomputeScores = recomputeScores;
exports.recomputeAllScores = recomputeAllScores;
exports.toGrade = toGrade;
