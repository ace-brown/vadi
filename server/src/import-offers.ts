import type { Model, Types } from 'mongoose';
import Provider, { type IProvider } from './models/provider';
import { OFFER_MODELS } from './models/internet/offer-models';
import AvailabilityCheck from './models/availability-check';
import type { IOffer } from './models/schemas/offer-schema';
import { recomputeAllScores } from './scoring';

// One offer row in a feed: the offer's fields plus the provider's slug
export type FeedOffer = { externalId?: string; providerSlug: string } & Record<string, unknown>;

export interface Feed {
    providers?: (Partial<IProvider> & { slug: string })[];
    homeTariffs?: FeedOffer[];
    mobileTariffs?: FeedOffer[];
}

export interface ImportSummary {
    providers: { created: number; updated: number };
    offers: { created: number; updated: number; deactivated: number };
    errors: string[];
}

const OFFER_TYPES: { key: 'homeTariffs' | 'mobileTariffs'; Model: Model<IOffer> }[] = [
    { key: 'homeTariffs', Model: OFFER_MODELS.home },
    { key: 'mobileTariffs', Model: OFFER_MODELS.mobile },
];

// Import a feed of the form
//   { providers: [{ slug, name, ... }], homeTariffs: [{ externalId, providerSlug, ... }], mobileTariffs: [...] }
//
// Providers are matched by slug and offers by externalId: existing ones are
// updated, new ones created. Offers of a provider in the feed that are no longer
// listed are switched off (not deleted). Every imported offer gets lastCheckedAt = now.
export async function importFeed(feed: Feed, { dryRun = false, now = new Date() } = {}): Promise<ImportSummary> {
    const summary: ImportSummary = { providers: { created: 0, updated: 0 }, offers: { created: 0, updated: 0, deactivated: 0 }, errors: [] };
    const providerIds: Record<string, Types.ObjectId> = {};
    const providerNames: Record<string, string> = {};

    for (const data of feed.providers || []) {
        let provider = await Provider.findOne({ slug: data.slug });
        if (provider) {
            provider.set(data);
            summary.providers.updated += 1;
        } else {
            provider = new Provider(data);
            summary.providers.created += 1;
        }
        await (dryRun ? provider.validate() : provider.save());
        providerIds[data.slug] = provider._id;
        providerNames[data.slug] = provider.name;
    }

    async function providerIdFor(slug: string): Promise<Types.ObjectId> {
        if (!providerIds[slug]) {
            const provider = await Provider.findOne({ slug });
            if (!provider) throw new Error(`Unknown provider "${slug}"`);
            providerIds[slug] = provider._id;
        }
        return providerIds[slug];
    }

    for (const { key, Model } of OFFER_TYPES) {
        const seenByProvider: Record<string, string[]> = {};

        for (const row of feed[key] || []) {
            try {
                if (!row.externalId) throw new Error('externalId is required');
                const { providerSlug, ...fields } = row;
                const providerId = await providerIdFor(providerSlug);

                let offer = await Model.findOne({ externalId: row.externalId });
                if (offer) {
                    summary.offers.updated += 1;
                } else {
                    offer = new Model();
                    summary.offers.created += 1;
                }
                offer.set({ active: true, ...fields, providerId, lastCheckedAt: now });
                if (dryRun && providerNames[providerSlug]) {
                    offer.$locals.providerName = providerNames[providerSlug];
                }
                await (dryRun ? offer.validate() : offer.save());

                (seenByProvider[String(providerId)] ||= []).push(row.externalId);
            } catch (err) {
                summary.errors.push(`${key} ${row.externalId || '(no externalId)'}: ${(err as Error).message}`);
            }
        }

        // Offers from these providers that the feed no longer contains
        for (const [providerId, externalIds] of Object.entries(seenByProvider)) {
            const stale = { providerId, active: true, externalId: { $nin: externalIds, $ne: null } };
            if (dryRun) {
                summary.offers.deactivated += await Model.countDocuments(stale);
            } else {
                const result = await Model.updateMany(stale, { $set: { active: false } });
                summary.offers.deactivated += result.modifiedCount;
            }
        }
    }

    if (!dryRun) {
        await recomputeAllScores();
        await AvailabilityCheck.deleteMany({});
    }
    return summary;
}
