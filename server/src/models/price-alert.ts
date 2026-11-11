import mongoose, { Types } from 'mongoose';
import type { OfferKind } from '../types';

export interface IPriceAlert {
    user: Types.ObjectId;
    offerType: OfferKind;
    offer: Types.ObjectId;
    targetPrice: number;
    active: boolean;
    triggeredAt: Date | null;
    triggeredPrice: number | null;
    createdAt: Date;
    updatedAt: Date;
}

// "Tell me when this offer costs at most X per month" (effective price)
const priceAlertSchema = new mongoose.Schema<IPriceAlert>(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        offerType: { type: String, required: true, enum: ['home', 'mobile'] },
        offer: { type: mongoose.Schema.Types.ObjectId, required: true },
        targetPrice: { type: Number, required: true, min: 0 },
        // Switched off once the alert has fired; setting a new target turns it on again
        active: { type: Boolean, default: true, index: true },
        triggeredAt: { type: Date, default: null },
        triggeredPrice: { type: Number, default: null },
    },
    { timestamps: true }
);

priceAlertSchema.index({ user: 1, offer: 1 }, { unique: true });

export default mongoose.model<IPriceAlert>('PriceAlert', priceAlertSchema);
