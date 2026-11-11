import crypto from 'crypto';
import HomeTariff from '../models/internet/home-tariff';
import Provider from '../models/provider';
import AvailabilityCheck from '../models/availability-check';
import HttpError from '../models/http-error';
import { activeOfferFilter } from '../models/schemas/offer-schema';
import sampleAdapter from './sample-adapter';
import postcodeAdapter from './postcode-adapter';
import type { Address, AvailabilityAdapter, ProviderAvailability, RawAddress } from './types';

// Adapters answer "which connections does this provider offer at this address?".
// Register a real provider API here by slug; providers without one use the
// sample adapter (AVAILABILITY_SAMPLE=true, for the fictional data) or the
// postcode-based estimate.
//
// adapter.check(address, provider, offers) resolves to
//   [{ connectionType: 'Fiber', maxDownloadMbps: 1000 }, ...]   ([] = not available)
const ADAPTERS: Record<string, AvailabilityAdapter> = {
    // 'some-provider-slug': someProviderAdapter,
};

function fallbackAdapter(): AvailabilityAdapter {
    return process.env.AVAILABILITY_SAMPLE === 'false' ? postcodeAdapter : sampleAdapter;
}

export function normalizeAddress({ postcode, street, houseNumber }: RawAddress): Address {
    const clean = (value: unknown) => String(value ?? '').trim().replace(/\s+/g, ' ');
    const address = {
        postcode: clean(postcode),
        street: clean(street),
        houseNumber: clean(houseNumber).toUpperCase(),
    };
    if (!/^\d{5}$/.test(address.postcode)) throw new HttpError('Postcode must have 5 digits', 400);
    if (address.street.length < 2 || address.street.length > 100) throw new HttpError('Please enter a street', 400);
    if (!/^\d{1,4}\s?[A-Z]?(-\d{1,4})?$/.test(address.houseNumber)) {
        throw new HttpError('Please enter a valid house number', 400);
    }
    return address;
}

function addressKey(address: Address): string {
    const text = `${address.postcode}|${address.street.toLowerCase().replace(/str\.?$/, 'straße')}|${address.houseNumber}`;
    return crypto.createHash('sha256').update(text).digest('hex');
}

export interface AddressCheck {
    address: Address;
    results: ProviderAvailability[];
    checkedAt: Date;
    cached: boolean;
}

// Check every provider that has home internet offers, using the cache when possible.
// Returns [{ providerId, provider, source, connections: [...] }]
export async function checkAddress(rawAddress: RawAddress): Promise<AddressCheck> {
    const address = normalizeAddress(rawAddress);
    const key = addressKey(address);

    const cached = await AvailabilityCheck.findOne({ addressKey: key });
    if (cached) {
        return { address, results: cached.results, checkedAt: cached.checkedAt, cached: true };
    }

    const offers = await HomeTariff.find(activeOfferFilter()).select('providerId connectionType downloadMbps coverage');
    const providerIds = [...new Set(offers.map((offer) => String(offer.providerId)))];
    const providers = await Provider.find({ _id: { $in: providerIds } }).select('name slug');

    const results = await Promise.all(providers.map(async (provider): Promise<ProviderAvailability> => {
        const adapter = ADAPTERS[provider.slug] ?? fallbackAdapter();
        const providerOffers = offers.filter((offer) => String(offer.providerId) === String(provider._id));
        try {
            const connections = await adapter.check(address, provider, providerOffers);
            return { providerId: provider._id, provider: provider.name, source: adapter.source, connections };
        } catch (err) {
            // One failing provider API shouldn't break the whole check
            console.error(`Availability check failed for ${provider.slug}:`, (err as Error).message);
            return { providerId: provider._id, provider: provider.name, source: 'error', connections: [] };
        }
    }));

    const checkedAt = new Date();
    await AvailabilityCheck.updateOne(
        { addressKey: key },
        { $set: { results, checkedAt } },
        { upsert: true }
    );
    return { address, results, checkedAt, cached: false };
}

// Filter for home internet offers that can be booked at the address in the query
// (?postcode=&street=&houseNumber=): provider, connection type and speed must fit
export async function addressFilter(_street: unknown, query: RawAddress) {
    const { results } = await checkAddress(query);
    const conditions = results.flatMap((result) =>
        result.connections.map((connection) => ({
            providerId: result.providerId,
            connectionType: connection.connectionType,
            downloadMbps: { $lte: connection.maxDownloadMbps },
        }))
    );
    // Nothing available: match no offers
    return conditions.length > 0 ? { $or: conditions } : { _id: null };
}
