const mongoose = require('mongoose');

// Every offer is compared over the same period, so a cheap first year with an
// expensive second year, or a big setup fee, is visible in one number
const COMPARISON_MONTHS = 24;

function round2(value) {
    return Math.round(value * 100) / 100;
}

// Total and average monthly cost over COMPARISON_MONTHS, including promo prices,
// one-off fees and bonuses
function computeCosts({ monthlyPrice, promoMonths = 0, regularPrice, setupFee = 0, hardwareFee = 0, bonus = 0 }) {
    const months = Math.min(promoMonths || 0, COMPARISON_MONTHS);
    const afterPromo = regularPrice ?? monthlyPrice;
    const total = monthlyPrice * months
        + afterPromo * (COMPARISON_MONTHS - months)
        + (setupFee || 0)
        + (hardwareFee || 0)
        - (bonus || 0);
    return { totalCost24: round2(total), effectiveMonthlyPrice: round2(total / COMPARISON_MONTHS) };
}

const httpUrl = {
    validator: (value) => value === null || value === undefined || value === '' || /^https?:\/\/\S+$/i.test(value),
    message: 'Must be an http(s) URL',
};

// Fields shared by home internet and mobile offers
const offerFields = {
    providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true, index: true },
    // Copy of the provider's name, kept in sync on save, so offers can be searched by it
    provider: { type: String, trim: true, maxlength: 80 },
    name: { type: String, required: true, trim: true, maxlength: 80 },
    // ID of the offer in the partner's feed, used by the import job
    externalId: { type: String, trim: true, maxlength: 120, unique: true, sparse: true },
    termMonths: { type: Number, required: true, enum: [1, 12, 24] },
    // Price for the first `promoMonths` months; `regularPrice` afterwards (null = no change)
    monthlyPrice: { type: Number, required: true, min: 0 },
    promoMonths: { type: Number, min: 0, max: COMPARISON_MONTHS, default: 0 },
    regularPrice: { type: Number, min: 0, default: null },
    setupFee: { type: Number, min: 0, default: 0 },
    hardwareFee: { type: Number, min: 0, default: 0 },
    bonus: { type: Number, min: 0, default: 0 },
    // Calculated on save
    totalCost24: { type: Number },
    effectiveMonthlyPrice: { type: Number, index: true },
    // Set when the effective price changes, for "price dropped" labels
    previousEffectiveMonthlyPrice: { type: Number, default: null },
    priceChangedAt: { type: Date, default: null },
    // Vadi score (German school grade: 1.0 best, 5.0 worst) and its parts (0–100 each),
    // recalculated for all offers of a kind whenever offers change (see src/scoring.js)
    score: { type: Number, default: null, index: true },
    scoreDetails: {
        price: Number,
        performance: Number,
        flexibility: Number,
        provider: Number,
    },
    affiliateUrl: { type: String, trim: true, maxlength: 1000, validate: httpUrl },
    active: { type: Boolean, default: true, index: true },
    validFrom: { type: Date, default: null },
    validUntil: { type: Date, default: null },
    lastCheckedAt: { type: Date, default: null },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
};

// kind: 'home' or 'mobile', stored with the price history
function createOfferSchema(extraFields, kind) {
    const schema = new mongoose.Schema({ ...offerFields, ...extraFields }, { timestamps: true });

    // Remember the price as loaded, to detect changes on save
    schema.post('init', function () {
        this.$locals.loadedEffectivePrice = this.effectiveMonthlyPrice;
    });

    schema.pre('validate', async function () {
        if (this.promoMonths > 0 && this.regularPrice === null) {
            this.invalidate('regularPrice', 'A price after the promo period is required when promoMonths is set');
        }
        Object.assign(this, computeCosts(this));

        // Set by a dry-run import, where a new provider in the same feed isn't saved
        if (this.$locals.providerName) {
            this.provider = this.$locals.providerName;
        } else if (this.isModified('providerId') && this.providerId) {
            const provider = await mongoose.model('Provider').findById(this.providerId);
            if (!provider) {
                this.invalidate('providerId', 'Provider not found');
            } else {
                this.provider = provider.name;
            }
        }
    });

    schema.pre('save', function () {
        const before = this.$locals.loadedEffectivePrice;
        this.$locals.priceChanged = this.isNew || before !== this.effectiveMonthlyPrice;
        if (!this.isNew && this.$locals.priceChanged) {
            this.previousEffectiveMonthlyPrice = before;
            this.priceChangedAt = new Date();
        }
    });

    // Keep a history of effective prices
    schema.post('save', async function () {
        if (!this.$locals.priceChanged) return;
        this.$locals.loadedEffectivePrice = this.effectiveMonthlyPrice;
        await mongoose.model('PriceHistory').create({
            offerType: kind,
            offer: this._id,
            effectiveMonthlyPrice: this.effectiveMonthlyPrice,
            monthlyPrice: this.monthlyPrice,
        });
    });

    schema.index({ active: 1, effectiveMonthlyPrice: 1 });
    schema.index({ termMonths: 1 });
    return schema;
}

// Only offers that are switched on and currently valid are shown to visitors
function activeOfferFilter(now = new Date()) {
    return {
        active: true,
        $and: [
            { $or: [{ validFrom: null }, { validFrom: { $lte: now } }] },
            { $or: [{ validUntil: null }, { validUntil: { $gte: now } }] },
        ],
    };
}

exports.COMPARISON_MONTHS = COMPARISON_MONTHS;
exports.computeCosts = computeCosts;
exports.createOfferSchema = createOfferSchema;
exports.activeOfferFilter = activeOfferFilter;
exports.httpUrl = httpUrl;
