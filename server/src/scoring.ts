import type { HydratedDocument } from 'mongoose';
import type { IHomeTariff } from './models/internet/home-tariff';
import type { IMobileTariff } from './models/internet/mobile-tariff';
import { OFFER_MODELS } from './models/internet/offer-models';
import './models/provider'; // populated when scoring
import type { IProvider } from './models/provider';
import { activeOfferFilter, type IOffer, type ScoreDetails } from './models/schemas/offer-schema';
import type { OfferKind } from './types';

// How much each part counts towards the Vadi score. Published on the
// "How we compare" page, so keep the two in sync.
export const SCORE_WEIGHTS: Record<keyof ScoreDetails, number> = { price: 0.5, performance: 0.3, flexibility: 0.1, provider: 0.1 };

const TERM_FLEXIBILITY: Record<number, number> = { 1: 100, 12: 60, 24: 30 };

type ScoredOffer = HydratedDocument<Omit<IOffer, 'providerId'> & { providerId: IProvider | null }>;

function round1(value: number): number {
    return Math.round(value * 10) / 10;
}

// Scale values to 0–100 across the set; `higherIsBetter` decides the direction
function normalize(values: number[], higherIsBetter: boolean): number[] {
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
function rawPerformance(kind: OfferKind, offer: ScoredOffer, maxData: number): number {
    if (kind === 'home') {
        const home = offer as unknown as IHomeTariff;
        return 0.8 * Math.log2(home.downloadMbps + 1) + 0.2 * Math.log2(home.uploadMbps + 1);
    }
    const mobile = offer as unknown as IMobileTariff;
    const data = mobile.dataGB === null ? maxData * 2 : mobile.dataGB; // unlimited beats every limit
    return Math.log2(data + 1) + (mobile.network === '5G' ? 1 : 0) + (mobile.minutes === null ? 0.5 : 0);
}

// Grade from 1.0 (best) to 5.0 (worst) from a 0–100 total
export function toGrade(total: number): number {
    return Math.min(5, Math.max(1, round1(1 + 4 * (1 - total / 100))));
}

// Recalculate the score of every offer of one kind. Scores are relative to the
// other active offers, so they all change when one offer changes.
export async function recomputeScores(kind: OfferKind): Promise<void> {
    const Model = OFFER_MODELS[kind];
    const offers: ScoredOffer[] = await Model.find(activeOfferFilter())
        .populate<{ providerId: IProvider | null }>('providerId', 'rating');

    // Inactive or expired offers have no score
    await Model.updateMany(
        { _id: { $nin: offers.map((offer) => offer._id) } },
        { $set: { score: null, scoreDetails: null } }
    );
    if (offers.length === 0) return;

    const maxData = Math.max(1, ...offers.map((offer) => (offer as unknown as IMobileTariff).dataGB ?? 0));
    const price = normalize(offers.map((offer) => offer.effectiveMonthlyPrice), false);
    const performance = normalize(offers.map((offer) => rawPerformance(kind, offer, maxData)), true);

    await Model.bulkWrite(
        offers.map((offer, i) => {
            const rating = offer.providerId?.rating;
            const details: ScoreDetails = {
                price: price[i],
                performance: performance[i],
                flexibility: TERM_FLEXIBILITY[offer.termMonths] ?? 30,
                provider: rating !== undefined && rating !== null ? Math.round((rating / 5) * 100) : 50,
            };
            const total = (Object.entries(SCORE_WEIGHTS) as [keyof ScoreDetails, number][])
                .reduce((sum, [part, weight]) => sum + details[part] * weight, 0);
            return {
                updateOne: {
                    filter: { _id: offer._id },
                    update: { $set: { score: toGrade(total), scoreDetails: details } },
                },
            };
        })
    );
}

export async function recomputeAllScores(): Promise<void> {
    await recomputeScores('home');
    await recomputeScores('mobile');
}
