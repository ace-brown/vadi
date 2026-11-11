import mongoose, { Types } from 'mongoose';
import type { OfferKind } from '../types';

export interface IClick {
    offerType: OfferKind;
    offer: Types.ObjectId;
    provider?: Types.ObjectId;
    createdAt: Date;
}

// One "go to offer" click. Deliberately no IP address or user ID.
const clickSchema = new mongoose.Schema<IClick>(
    {
        offerType: { type: String, required: true, enum: ['home', 'mobile'] },
        offer: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
        provider: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider' },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

clickSchema.index({ createdAt: -1 });

const Click = mongoose.model<IClick>('Click', clickSchema);
export default Click;
