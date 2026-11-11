import mongoose from 'mongoose';
import { createOfferSchema, type IOffer } from '../schemas/offer-schema';
import '../price-history';

export type ConnectionType = 'DSL' | 'VDSL' | 'Cable' | 'Fiber' | 'LTE';

export interface IHomeTariff extends IOffer {
    connectionType: ConnectionType;
    downloadMbps: number;
    uploadMbps: number;
    coverage: {
        nationwide: boolean;
        postcodePrefixes: string[];
    };
}

const homeTariffSchema = createOfferSchema<IHomeTariff>({
    connectionType: { type: String, required: true, enum: ['DSL', 'VDSL', 'Cable', 'Fiber', 'LTE'], index: true },
    downloadMbps: { type: Number, required: true, min: 0 },
    uploadMbps: { type: Number, required: true, min: 0 },
    // Where the offer can be booked: everywhere, or only in postcodes starting with these prefixes
    coverage: {
        nationwide: { type: Boolean, default: true },
        postcodePrefixes: {
            type: [{ type: String, match: /^\d{1,5}$/ }],
            default: [],
        },
    },
}, 'home');

const HomeTariff = mongoose.model<IHomeTariff>('HomeTariff', homeTariffSchema);
export default HomeTariff;
