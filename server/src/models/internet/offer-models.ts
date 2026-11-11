import type { Model } from 'mongoose';
import HomeTariff from './home-tariff';
import MobileTariff from './mobile-tariff';
import type { IOffer } from '../schemas/offer-schema';
import type { OfferKind } from '../../types';

// The offer model for each kind, for code that only needs the shared offer fields.
// (A union of the two models can't be called in TypeScript, so both are typed as
// models of the shared fields.)
export const OFFER_MODELS: Record<OfferKind, Model<IOffer>> = {
    home: HomeTariff as unknown as Model<IOffer>,
    mobile: MobileTariff as unknown as Model<IOffer>,
};

export function isOfferKind(value: unknown): value is OfferKind {
    return value === 'home' || value === 'mobile';
}
