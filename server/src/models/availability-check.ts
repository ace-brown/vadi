import mongoose from 'mongoose';
import type { ProviderAvailability } from '../availability/types';

export interface IAvailabilityCheck {
    addressKey: string;
    results: ProviderAvailability[];
    checkedAt: Date;
}

// Cached result of an address availability check, kept for 7 days
const availabilityCheckSchema = new mongoose.Schema<IAvailabilityCheck>({
    addressKey: { type: String, required: true, unique: true },
    results: { type: [{}], default: [] },
    checkedAt: { type: Date, default: Date.now, expires: 7 * 24 * 60 * 60 },
});

export default mongoose.model<IAvailabilityCheck>('AvailabilityCheck', availabilityCheckSchema);
