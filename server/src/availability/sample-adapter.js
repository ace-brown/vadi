const crypto = require('crypto');

// Stand-in for real provider APIs, for the fictional sample data. It is
// deterministic: the same address always gives the same answer.
//
// Based on the provider's offers: a connection type is possible where the offer's
// coverage allows it, and then available with a fixed chance per address.
const CHANCE = { Fiber: 0.7, Cable: 0.8, VDSL: 0.85, DSL: 1, LTE: 0.9 };
const VDSL_SPEEDS = [50, 100, 250];

// Number in [0, 1) derived from the address, provider and connection type
function addressRandom(address, provider, connectionType) {
    const text = `${address.postcode}|${address.street.toLowerCase()}|${address.houseNumber}|${provider.slug}|${connectionType}`;
    return crypto.createHash('sha256').update(text).digest().readUInt32BE(0) / 2 ** 32;
}

function coveredByOffer(offer, postcode) {
    return offer.coverage?.nationwide !== false
        || (offer.coverage?.postcodePrefixes ?? []).some((prefix) => postcode.startsWith(prefix));
}

async function check(address, provider, offers) {
    const byType = {};
    offers
        .filter((offer) => coveredByOffer(offer, address.postcode))
        .forEach((offer) => {
            byType[offer.connectionType] = Math.max(byType[offer.connectionType] ?? 0, offer.downloadMbps);
        });

    return Object.entries(byType)
        .filter(([type]) => addressRandom(address, provider, type) < (CHANCE[type] ?? 0.5))
        .map(([connectionType, fastestOffer]) => {
            let maxDownloadMbps = fastestOffer;
            // The copper line limits VDSL; it is the same line for every VDSL provider
            if (connectionType === 'VDSL') {
                const line = addressRandom(address, { slug: 'line' }, 'VDSL');
                maxDownloadMbps = VDSL_SPEEDS[Math.floor(line * VDSL_SPEEDS.length)];
            }
            return { connectionType, maxDownloadMbps };
        });
}

module.exports = { source: 'sample', check };
