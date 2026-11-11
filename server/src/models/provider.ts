import mongoose from 'mongoose';
import { httpUrl } from './schemas/offer-schema';

export interface IProvider {
    name: string;
    slug: string;
    logo?: string;
    website?: string;
    legalName?: string;
    imprintUrl?: string;
    description?: string;
    rating?: number;
    ratingSource?: string;
    createdAt: Date;
    updatedAt: Date;
}

const providerSchema = new mongoose.Schema<IProvider>(
    {
        name: { type: String, required: true, trim: true, maxlength: 80, unique: true },
        slug: { type: String, required: true, trim: true, lowercase: true, match: /^[a-z0-9-]+$/, unique: true },
        // Path under uploads/ or a full URL
        logo: { type: String, trim: true, maxlength: 300 },
        website: { type: String, trim: true, maxlength: 300, validate: httpUrl },
        legalName: { type: String, trim: true, maxlength: 160 },
        imprintUrl: { type: String, trim: true, maxlength: 300, validate: httpUrl },
        description: { type: String, trim: true, maxlength: 1000 },
        // Editorial rating and where it comes from, shown next to customer reviews
        rating: { type: Number, min: 0, max: 5 },
        ratingSource: { type: String, trim: true, maxlength: 200 },
    },
    { timestamps: true }
);

// Offers keep a copy of the provider's name for searching; update it on rename
providerSchema.pre('save', function () {
    this.$locals.nameChanged = !this.isNew && this.isModified('name');
});
providerSchema.post('save', async function () {
    if (!this.$locals.nameChanged) return;
    for (const modelName of ['HomeTariff', 'MobileTariff']) {
        await mongoose.model(modelName).updateMany({ providerId: this._id }, { $set: { provider: this.name } });
    }
});

const Provider = mongoose.model<IProvider>('Provider', providerSchema);
export default Provider;
