import mongoose from 'mongoose';
import { createOfferSchema, type IOffer } from '../schemas/offer-schema';
import '../price-history';

export interface IMobileTariff extends IOffer {
    contractType: 'prepaid' | 'contract';
    network: '4G' | '5G';
    // null means unlimited
    dataGB: number | null;
    minutes: number | null;
}

const mobileTariffSchema = createOfferSchema<IMobileTariff>({
    contractType: { type: String, required: true, enum: ['prepaid', 'contract'], index: true },
    network: { type: String, required: true, enum: ['4G', '5G'] },
    // null means unlimited
    dataGB: { type: Number, min: 0, default: null },
    minutes: { type: Number, min: 0, default: null },
}, 'mobile');

const MobileTariff = mongoose.model<IMobileTariff>('MobileTariff', mobileTariffSchema);
export default MobileTariff;
