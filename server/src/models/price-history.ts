import mongoose, { Types } from 'mongoose';
import type { OfferKind } from '../types';

export interface IPriceHistory {
    offerType: OfferKind;
    offer: Types.ObjectId;
    effectiveMonthlyPrice: number;
    monthlyPrice: number;
    recordedAt: Date;
}

// One entry each time an offer's effective price changes (and when it is created)
const priceHistorySchema = new mongoose.Schema<IPriceHistory>(
    {
        offerType: { type: String, required: true, enum: ['home', 'mobile'] },
        offer: { type: mongoose.Schema.Types.ObjectId, required: true },
        effectiveMonthlyPrice: { type: Number, required: true },
        monthlyPrice: { type: Number, required: true },
    },
    { timestamps: { createdAt: 'recordedAt', updatedAt: false } }
);

priceHistorySchema.index({ offer: 1, recordedAt: 1 });

const PriceHistory: mongoose.Model<IPriceHistory> =
    mongoose.models.PriceHistory || mongoose.model<IPriceHistory>('PriceHistory', priceHistorySchema);
export default PriceHistory;
