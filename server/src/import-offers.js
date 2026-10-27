const Provider = require('./models/provider');
const HomeTariff = require('./models/internet/home-tariff');
const MobileTariff = require('./models/internet/mobile-tariff');

const OFFER_TYPES = [
    { key: 'homeTariffs', Model: HomeTariff },
    { key: 'mobileTariffs', Model: MobileTariff },
];

// Import a feed of the form
//   { providers: [{ slug, name, ... }], homeTariffs: [{ externalId, providerSlug, ... }], mobileTariffs: [...] }
//
// Providers are matched by slug and offers by externalId: existing ones are
// updated, new ones created. Offers of a provider in the feed that are no longer
// listed are switched off (not deleted). Every imported offer gets lastCheckedAt = now.
async function importFeed(feed, { dryRun = false, now = new Date() } = {}) {
    const summary = { providers: { created: 0, updated: 0 }, offers: { created: 0, updated: 0, deactivated: 0 }, errors: [] };
    const providerIds = {};
    const providerNames = {};

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

    async function providerIdFor(slug) {
        if (!providerIds[slug]) {
            const provider = await Provider.findOne({ slug });
            if (!provider) throw new Error(`Unknown provider "${slug}"`);
            providerIds[slug] = provider._id;
        }
        return providerIds[slug];
    }

    for (const { key, Model } of OFFER_TYPES) {
        const seenByProvider = {};

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

                (seenByProvider[providerId] ||= []).push(row.externalId);
            } catch (err) {
                summary.errors.push(`${key} ${row.externalId || '(no externalId)'}: ${err.message}`);
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

    return summary;
}

exports.importFeed = importFeed;
