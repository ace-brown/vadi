const HomeTariff = require('./models/internet/home-tariff');
const MobileTariff = require('./models/internet/mobile-tariff');
const HttpError = require('./models/http-error');
const { activeOfferFilter } = require('./models/schemas/offer-schema');
const { addressFilter } = require('./availability');

const PROVIDER_FIELDS = 'name slug logo rating';
const SPEED_TIERS = [16, 50, 100, 250, 500, 1000];
const MAX_RESULTS = 3;

// Reasons are returned as codes with parameters, so the client can translate them
const reason = (code, params = {}) => ({ code, params });

function round2(value) {
    return Math.round(value * 100) / 100;
}

function nextTier(mbps) {
    return SPEED_TIERS.find((tier) => tier >= mbps) ?? SPEED_TIERS[SPEED_TIERS.length - 1];
}

function checkNumber(value, name, min, max) {
    if (value === undefined || value === null || value === '') return null;
    const number = Number(value);
    if (Number.isNaN(number) || number < min || number > max) {
        throw new HttpError(`${name} must be a number between ${min} and ${max}`, 422);
    }
    return number;
}

// Rank offers by how well they meet the criteria. Each criterion is
// { key, test(offer) }; the budget is checked separately so it can be relaxed first.
// Returns the best offers, relaxing first the budget and then the criteria (in the
// order given, last = most important) when nothing fits everything.
function rank(offers, criteria, budget) {
    const evaluated = offers.map((offer) => {
        const failed = criteria.filter((criterion) => !criterion.test(offer)).map((criterion) => criterion.key);
        const overBudget = budget !== null && offer.effectiveMonthlyPrice > budget;
        return { offer, failed, overBudget };
    });
    const byPrice = (a, b) => a.offer.effectiveMonthlyPrice - b.offer.effectiveMonthlyPrice || (a.offer.score ?? 5) - (b.offer.score ?? 5);

    let pool = evaluated.filter((item) => item.failed.length === 0 && !item.overBudget);
    const relaxed = [];
    if (pool.length === 0) {
        pool = evaluated.filter((item) => item.failed.length === 0);
        if (budget !== null) relaxed.push('budget');
    }
    if (pool.length === 0) {
        // Prefer offers that miss fewer (and less important) criteria
        const weight = (item) => item.failed.reduce((sum, key) => sum + 1 + criteria.findIndex((c) => c.key === key) / 10, 0);
        pool = [...evaluated].sort((a, b) => weight(a) - weight(b) || byPrice(a, b));
        relaxed.push(...new Set(pool.slice(0, MAX_RESULTS).flatMap((item) => item.failed)));
        return { picks: pool.slice(0, MAX_RESULTS), relaxed };
    }
    return { picks: [...pool].sort(byPrice).slice(0, MAX_RESULTS), relaxed };
}

function labelPicks(picks) {
    if (picks.length === 0) return;
    picks[0].labels = ['cheapest'];
    const bestScore = picks.reduce((best, item) => ((item.offer.score ?? 5) < (best.offer.score ?? 5) ? item : best));
    bestScore.labels = [...(bestScore.labels ?? []), 'bestScore'];
}

function budgetReason(offer, budget) {
    if (budget === null) return [];
    const difference = round2(budget - offer.effectiveMonthlyPrice);
    return [difference >= 0 ? reason('withinBudget', { difference }) : reason('overBudget', { difference: -difference })];
}

// Mobile: { dataGB (null = unlimited), unlimitedCalls, need5G, budget, monthlyCancellable, planType: 'prepaid'|'contract'|'any' }
async function adviseMobile(input) {
    const needs = {
        dataGB: input.dataGB === null || input.dataGB === 'unlimited' ? null : checkNumber(input.dataGB, 'dataGB', 0, 1000) ?? 5,
        unlimitedCalls: Boolean(input.unlimitedCalls),
        need5G: Boolean(input.need5G),
        monthlyCancellable: Boolean(input.monthlyCancellable),
        planType: ['prepaid', 'contract'].includes(input.planType) ? input.planType : 'any',
    };
    const budget = checkNumber(input.budget, 'budget', 0, 1000);

    const offers = await MobileTariff.find(activeOfferFilter()).populate('providerId', PROVIDER_FIELDS);
    // Least important first
    const criteria = [
        { key: 'network', test: (o) => !needs.need5G || o.network === '5G' },
        { key: 'term', test: (o) => !needs.monthlyCancellable || o.termMonths === 1 },
        { key: 'calls', test: (o) => !needs.unlimitedCalls || o.minutes === null },
        { key: 'planType', test: (o) => needs.planType === 'any' || o.contractType === needs.planType },
        { key: 'data', test: (o) => o.dataGB === null || (needs.dataGB !== null && o.dataGB >= needs.dataGB) },
    ];
    const { picks, relaxed } = rank(offers, criteria, budget);
    labelPicks(picks);

    const recommendations = picks.map(({ offer, failed, labels }) => ({
        offer,
        labels: labels ?? [],
        reasons: [
            offer.dataGB === null
                ? reason('unlimitedData')
                : reason(failed.includes('data') ? 'notEnoughData' : 'enoughData', { offered: offer.dataGB, needed: needs.dataGB }),
            ...(offer.network === '5G' ? [reason('network5G')] : []),
            ...(offer.minutes === null ? [reason('unlimitedCalls')] : []),
            ...(offer.termMonths === 1 ? [reason('monthlyCancellable')] : []),
            ...budgetReason(offer, budget),
            ...(offer.score !== null ? [reason('score', { score: offer.score })] : []),
            ...failed.filter((key) => key !== 'data').map((key) => reason('missing', { criterion: key })),
        ],
    }));
    return { needs: { ...needs, budget }, relaxed, recommendations };
}

// Home: { postcode, street?, houseNumber?, people, usage: ['basic'|'streaming'|'gaming'|'homeoffice'], budget, monthlyCancellable }
async function adviseHome(input) {
    const people = checkNumber(input.people, 'people', 1, 10) ?? 1;
    const usage = Array.isArray(input.usage) ? input.usage.filter((u) => ['basic', 'streaming', 'gaming', 'homeoffice'].includes(u)) : [];
    const perPerson = usage.includes('streaming') ? 25 : 10;
    const minDownloadMbps = nextTier(Math.max(16, people * perPerson + (usage.includes('gaming') ? 50 : 0)));
    const minUploadMbps = usage.includes('homeoffice') ? (people > 2 ? 40 : 20) : 0;
    const needs = { people, usage, minDownloadMbps, minUploadMbps, monthlyCancellable: Boolean(input.monthlyCancellable) };
    const budget = checkNumber(input.budget, 'budget', 0, 1000);

    if (!/^\d{5}$/.test(String(input.postcode ?? ''))) {
        throw new HttpError('Postcode must have 5 digits', 422);
    }
    const prefixes = [1, 2, 3, 4, 5].map((length) => String(input.postcode).slice(0, length));
    const location = input.street && input.houseNumber
        ? await addressFilter(input.street, input)
        : { $or: [{ 'coverage.nationwide': true }, { 'coverage.postcodePrefixes': { $in: prefixes } }] };

    const offers = await HomeTariff.find({ $and: [activeOfferFilter(), location] }).populate('providerId', PROVIDER_FIELDS);
    const lowLatency = (o) => o.connectionType === 'Fiber' || o.connectionType === 'Cable';
    const criteria = [
        { key: 'latency', test: (o) => !usage.includes('gaming') || lowLatency(o) },
        { key: 'term', test: (o) => !needs.monthlyCancellable || o.termMonths === 1 },
        { key: 'upload', test: (o) => o.uploadMbps >= minUploadMbps },
        { key: 'speed', test: (o) => o.downloadMbps >= minDownloadMbps },
    ];
    const { picks, relaxed } = rank(offers, criteria, budget);
    labelPicks(picks);

    const recommendations = picks.map(({ offer, failed, labels }) => ({
        offer,
        labels: labels ?? [],
        reasons: [
            reason(failed.includes('speed') ? 'notEnoughSpeed' : 'enoughSpeed', { offered: offer.downloadMbps, needed: minDownloadMbps }),
            ...(minUploadMbps > 0 && !failed.includes('upload') ? [reason('enoughUpload', { offered: offer.uploadMbps, needed: minUploadMbps })] : []),
            ...(usage.includes('gaming') && lowLatency(offer) ? [reason('lowLatency', { type: offer.connectionType })] : []),
            ...(input.street && input.houseNumber ? [reason('availableAtAddress')] : []),
            ...(offer.termMonths === 1 ? [reason('monthlyCancellable')] : []),
            ...budgetReason(offer, budget),
            ...(offer.score !== null ? [reason('score', { score: offer.score })] : []),
            ...failed.filter((key) => key !== 'speed').map((key) => reason('missing', { criterion: key })),
        ],
    }));
    return { needs: { ...needs, budget }, relaxed, recommendations };
}

exports.adviseMobile = adviseMobile;
exports.adviseHome = adviseHome;
